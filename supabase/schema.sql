-- ==============================================================================
-- SIGAP BESAPRAH: DDL SQL Schema & RLS Policies (Supabase / PostgreSQL)
-- Sistem Integrasi dan Gerakan Administrasi Pertanggungjawaban yang Rapi dan Akuntabel
-- Badan Pusat Statistik (BPS)
-- Tagline: "Bersaprah dalam Kerja, Sepakat dalam Akuntabilitas."
-- ==============================================================================

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Role Pengguna BPS
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM (
    'tim_kerja',    -- Pembuat pengajuan SPJ kegiatan
    'admin_tu',     -- Verifikasi awal kelengkapan fisik di Tata Usaha
    'ppk',          -- Pejabat Pembuat Komitmen (Validasi & Komitmen Anggaran)
    'bendahara',    -- Bendahara Pengeluaran (Pemeriksaan Pajak & Kuitansi)
    'ppspm'         -- Pejabat Penandatangan SPM & Penerbitan SP2D
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Posisi Alur Fisik Berkas SPJ
DO $$ BEGIN
  CREATE TYPE public.posisi_berkas_enum AS ENUM (
    'tim_kerja',
    'admin_tu',
    'ppk',
    'bendahara',
    'ppspm',
    'selesai'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Status Kelengkapan Visual (Lampu Lalu Lintas)
DO $$ BEGIN
  CREATE TYPE public.status_kelengkapan_enum AS ENUM (
    'merah',   -- Belum Lengkap / Perlu Revisi Fisik
    'kuning',  -- Sedang Divalidasi / Proses Verifikasi
    'hijau'    -- Lengkap / Selesai (SP2D Terbit)
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;


-- ==============================================================================
-- 2. TABEL-TABEL UTAMA
-- ==============================================================================

-- TABEL 1: Profil Pengguna (Terkoneksi ke auth.users)
CREATE TABLE IF NOT EXISTS public.users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nama_lengkap TEXT NOT NULL,
  nip VARCHAR(18),
  role public.user_role NOT NULL DEFAULT 'tim_kerja',
  jabatan TEXT,
  nomor_wa VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- TABEL 2: Master Akun Belanja (MAK)
CREATE TABLE IF NOT EXISTS public.master_akun (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kode_akun VARCHAR(20) NOT NULL UNIQUE,
  nama_akun TEXT NOT NULL,
  deskripsi TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- TABEL 3: Master Persyaratan Dokumen Berbasis MAK
CREATE TABLE IF NOT EXISTS public.master_syarat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  master_akun_id UUID NOT NULL REFERENCES public.master_akun(id) ON DELETE CASCADE,
  nama_syarat TEXT NOT NULL,
  is_wajib BOOLEAN NOT NULL DEFAULT true,
  urutan INTEGER NOT NULL DEFAULT 1,
  keterangan_tambahan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- TABEL 4: Pengajuan Berkas SPJ
CREATE TABLE IF NOT EXISTS public.pengajuan_spj (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users_profile(id) ON DELETE CASCADE,
  master_akun_id UUID NOT NULL REFERENCES public.master_akun(id) ON DELETE RESTRICT,
  nama_kegiatan TEXT NOT NULL,
  nomor_surat_tugas VARCHAR(100),
  tim_kerja VARCHAR(50) NOT NULL DEFAULT 'sosial',
  nama_pj TEXT,
  nominal_rpd NUMERIC(15, 2) NOT NULL DEFAULT 0,
  nominal_pengajuan NUMERIC(15, 2) NOT NULL DEFAULT 0,
  posisi_berkas public.posisi_berkas_enum NOT NULL DEFAULT 'tim_kerja',
  status_kelengkapan public.status_kelengkapan_enum NOT NULL DEFAULT 'merah',
  catatan_revisi TEXT,
  nomor_sp2d VARCHAR(100),
  tanggal_sp2d DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Migration pendukung jika tabel sudah ada di Supabase
ALTER TABLE public.pengajuan_spj ADD COLUMN IF NOT EXISTS tim_kerja VARCHAR(50) NOT NULL DEFAULT 'sosial';
ALTER TABLE public.pengajuan_spj ADD COLUMN IF NOT EXISTS nama_pj TEXT;

-- TABEL 5: Detail Checklist Dokumen Fisik Per Pengajuan SPJ
CREATE TABLE IF NOT EXISTS public.detail_syarat_spj (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pengajuan_spj_id UUID NOT NULL REFERENCES public.pengajuan_spj(id) ON DELETE CASCADE,
  master_syarat_id UUID NOT NULL REFERENCES public.master_syarat(id) ON DELETE CASCADE,
  is_checked BOOLEAN NOT NULL DEFAULT false,
  catatan_item TEXT,
  checked_at TIMESTAMPTZ,
  checked_by UUID REFERENCES public.users_profile(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_spj_master_syarat UNIQUE (pengajuan_spj_id, master_syarat_id)
);


-- ==============================================================================
-- 3. INDEXES UNTUK PERFORMA
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_profile_role ON public.users_profile(role);
CREATE INDEX IF NOT EXISTS idx_master_syarat_akun ON public.master_syarat(master_akun_id);
CREATE INDEX IF NOT EXISTS idx_pengajuan_spj_user ON public.pengajuan_spj(user_id);
CREATE INDEX IF NOT EXISTS idx_pengajuan_spj_posisi ON public.pengajuan_spj(posisi_berkas);
CREATE INDEX IF NOT EXISTS idx_pengajuan_spj_status ON public.pengajuan_spj(status_kelengkapan);
CREATE INDEX IF NOT EXISTS idx_pengajuan_spj_created ON public.pengajuan_spj(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_detail_syarat_pengajuan ON public.detail_syarat_spj(pengajuan_spj_id);


-- ==============================================================================
-- 4. TRIGGER: AUTO-SYNC PROFIL PENGGUNA BARU DARI auth.users
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_profile (id, nama_lengkap, nip, role, jabatan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nama_lengkap', NEW.email),
    NEW.raw_user_meta_data->>'nip',
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'tim_kerja'::public.user_role),
    NEW.raw_user_meta_data->>'jabatan'
  )
  ON CONFLICT (id) DO UPDATE SET
    nama_lengkap = COALESCE(EXCLUDED.nama_lengkap, public.users_profile.nama_lengkap),
    nip = COALESCE(EXCLUDED.nip, public.users_profile.nip),
    role = COALESCE(EXCLUDED.role, public.users_profile.role),
    jabatan = COALESCE(EXCLUDED.jabatan, public.users_profile.jabatan);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_on_auth_user_created ON auth.users;
CREATE TRIGGER tr_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();


-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Aktifkan RLS pada seluruh tabel
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_akun ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_syarat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengajuan_spj ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detail_syarat_spj ENABLE ROW LEVEL SECURITY;

-- Helper Function: Dapatkan Role Pengguna Saat Ini
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS public.user_role AS $$
  SELECT role FROM public.users_profile WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- --- Kebijakan: users_profile ---
-- 1. Semua pengguna terautentikasi dapat melihat profil rekan kerja
CREATE POLICY "Users can view all profiles"
  ON public.users_profile FOR SELECT
  TO authenticated
  USING (true);

-- 2. Pengguna dapat memperbarui profil miliknya sendiri
CREATE POLICY "Users can update their own profile"
  ON public.users_profile FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 3. Pengguna dapat memasukkan data profilnya
CREATE POLICY "Users can insert their own profile"
  ON public.users_profile FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- --- Kebijakan: master_akun & master_syarat ---
-- 1. Semua pengguna (termasuk anonim & terautentikasi) dapat membaca data master MAK dan syarat
DROP POLICY IF EXISTS "Authenticated users can read master_akun" ON public.master_akun;
DROP POLICY IF EXISTS "Allow public read on master_akun" ON public.master_akun;
CREATE POLICY "Allow public read on master_akun"
  ON public.master_akun FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can read master_syarat" ON public.master_syarat;
DROP POLICY IF EXISTS "Allow public read on master_syarat" ON public.master_syarat;
CREATE POLICY "Allow public read on master_syarat"
  ON public.master_syarat FOR SELECT
  TO anon, authenticated
  USING (true);

-- 2. Hanya role Admin TU dan PPK yang dapat mengubah/mengelola master data
CREATE POLICY "Admin TU and PPK can manage master_akun"
  ON public.master_akun FOR ALL
  TO authenticated
  USING (public.get_current_role() IN ('admin_tu', 'ppk'));

CREATE POLICY "Admin TU and PPK can manage master_syarat"
  ON public.master_syarat FOR ALL
  TO authenticated
  USING (public.get_current_role() IN ('admin_tu', 'ppk'));

-- --- Kebijakan: pengajuan_spj ---
-- 1. SELECT:
--    - Tim Kerja hanya melihat berkas buatannya
--    - Verifikator (Admin TU, PPK, Bendahara, PPSPM) dapat melihat seluruh berkas
CREATE POLICY "View pengajuan_spj based on role"
  ON public.pengajuan_spj FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR public.get_current_role() IN ('admin_tu', 'ppk', 'bendahara', 'ppspm')
  );

-- 2. INSERT: Semua user terautentikasi dapat membuat pengajuan baru
CREATE POLICY "Authenticated users can insert pengajuan_spj"
  ON public.pengajuan_spj FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 3. UPDATE:
--    - Tim Kerja dapat memperbarui pengajuannya sendiri HANYA jika berkas masih berada di 'tim_kerja'
--    - Verifikator (Admin TU, PPK, Bendahara, PPSPM) dapat memperbarui posisi & status kelengkapan
CREATE POLICY "Update pengajuan_spj based on role and position"
  ON public.pengajuan_spj FOR UPDATE
  TO authenticated
  USING (
    (user_id = auth.uid() AND posisi_berkas = 'tim_kerja')
    OR public.get_current_role() IN ('admin_tu', 'ppk', 'bendahara', 'ppspm')
  );

-- 4. DELETE: Pengaju hanya dapat menghapus saat masih draft di tim_kerja
CREATE POLICY "Delete draft pengajuan_spj only"
  ON public.pengajuan_spj FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() AND posisi_berkas = 'tim_kerja');

-- --- Kebijakan: detail_syarat_spj ---
-- 1. SELECT: Mengikuti hak akses pada pengajuan_spj induk
CREATE POLICY "View detail_syarat_spj"
  ON public.detail_syarat_spj FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.pengajuan_spj p
      WHERE p.id = detail_syarat_spj.pengajuan_spj_id
      AND (
        p.user_id = auth.uid()
        OR public.get_current_role() IN ('admin_tu', 'ppk', 'bendahara', 'ppspm')
      )
    )
  );

-- 2. INSERT: Otomatis diisi saat pengajuan dibuat oleh tim kerja atau verifikator
CREATE POLICY "Insert detail_syarat_spj"
  ON public.detail_syarat_spj FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.pengajuan_spj p
      WHERE p.id = detail_syarat_spj.pengajuan_spj_id
      AND (
        p.user_id = auth.uid()
        OR public.get_current_role() IN ('admin_tu', 'ppk', 'bendahara', 'ppspm')
      )
    )
  );

-- 3. UPDATE: Verifikator atau pemohon (saat status di tim_kerja)
CREATE POLICY "Update detail_syarat_spj"
  ON public.detail_syarat_spj FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.pengajuan_spj p
      WHERE p.id = detail_syarat_spj.pengajuan_spj_id
      AND (
        (p.user_id = auth.uid() AND p.posisi_berkas = 'tim_kerja')
        OR public.get_current_role() IN ('admin_tu', 'ppk', 'bendahara', 'ppspm')
      )
    )
  );


-- Migrasi Tambahan Kolom Baru jika database sudah berjalan
ALTER TABLE public.pengajuan_spj 
ADD COLUMN IF NOT EXISTS tim_kerja VARCHAR(50) DEFAULT 'sosial',
ADD COLUMN IF NOT EXISTS nama_pj TEXT,
ADD COLUMN IF NOT EXISTS metode_bayar VARCHAR(10) DEFAULT 'LS';

-- ==============================================================================
-- 6. DATA AWAL (SEED MASTER MAK & SYARAT DOKUMEN FISIK BPS - 12 KODE AKUN)
-- Referensi: Dokumen Resmi "Kelengkapan SPJ.xlsx" & "SPJ Proses 2026.xlsx" BPS
-- ==============================================================================

-- 1. Belanja Bahan (521211)
WITH akun AS (
  INSERT INTO public.master_akun (kode_akun, nama_akun, deskripsi)
  VALUES ('521211', 'Belanja Bahan', 'Konsumsi rapat koordinasi/evaluasi sensus survei, bahan pencetakan, dan perlengkapan kegiatan')
  ON CONFLICT (kode_akun) DO UPDATE SET nama_akun = EXCLUDED.nama_akun, deskripsi = EXCLUDED.deskripsi
  RETURNING id
)
INSERT INTO public.master_syarat (master_akun_id, nama_syarat, is_wajib, urutan)
SELECT akun.id, s.nama, s.wajib, s.urut FROM akun
CROSS JOIN (VALUES
  ('Identifikasi Kebutuhan & Form Perencanaan', true, 1),
  ('Surat Penetapan Perencanaan & KAK (Kerangka Acuan Kerja)', true, 2),
  ('Form Permintaan / Nota Dinas (SM ke PPK)', true, 3),
  ('Surat Undangan, Daftar Hadir & Notulen Rapat (khusus konsumsi)', true, 4),
  ('Kuitansi Pembelian Asli & Nota Toko bermeterai cukup', true, 5),
  ('Berita Acara Serah Terima (BAST) & Tanda Terima Distribusi Barang', true, 6),
  ('Faktur Pajak & Bukti Setor Pajak (SSP PPN, PPh 22, atau PPh 23 katering)', true, 7),
  ('Foto Dokumentasi Fisik Penerimaan Bahan / Makanan Rapat', false, 8)
) AS s(nama, wajib, urut)
ON CONFLICT DO NOTHING;

-- 2. Belanja Honor Output Kegiatan (521213)
WITH akun AS (
  INSERT INTO public.master_akun (kode_akun, nama_akun, deskripsi)
  VALUES ('521213', 'Belanja Honor Output Kegiatan', 'Honor Petugas Lapangan (PCL/PML/Mitra), Honor Tim Pokja, Honor Innas/Inda Pelatihan, Honor Camat/Kades/Lurah, Honor Penunjuk Jalan')
  ON CONFLICT (kode_akun) DO UPDATE SET nama_akun = EXCLUDED.nama_akun, deskripsi = EXCLUDED.deskripsi
  RETURNING id
)
INSERT INTO public.master_syarat (master_akun_id, nama_syarat, is_wajib, urutan)
SELECT akun.id, s.nama, s.wajib, s.urut FROM akun
CROSS JOIN (VALUES
  ('Kerangka Acuan Kerja (KAK) & Form Permintaan Honor', true, 1),
  ('Surat Keputusan (SK) KPA / SK Tim Pokja / Surat Tugas Resmi', true, 2),
  ('Surat Perjanjian Kerja (SPK / Kontrak Mitra) & Surat Pernyataan Kesanggupan', true, 3),
  ('Jadwal Kegiatan & Daftar Hadir (Innas/Inda/Peserta/Petugas)', true, 4),
  ('Daftar Real Aktivitas / Laporan Output Capaian Beban Kerja Lapangan', true, 5),
  ('Daftar Nominatif Penerima Honorarium & Rekapitulasi Belanja Honor', true, 6),
  ('Bukti Pemotongan Pajak PPh Pasal 21', true, 7),
  ('Bukti Pembayaran / Rekap Transfer Bank via CMS', true, 8),
  ('Berita Acara Serah Terima (BAST) Penyelesaian Pekerjaan', true, 9),
  ('(Khusus Penunjuk Jalan) Suket KPA Tunai, Surat Pendelegasian Wewenang, Kuitansi & Foto', false, 10)
) AS s(nama, wajib, urut)
ON CONFLICT DO NOTHING;

-- 3. Belanja Barang Non Operasional Lainnya (521219)
WITH akun AS (
  INSERT INTO public.master_akun (kode_akun, nama_akun, deskripsi)
  VALUES ('521219', 'Belanja Barang Non Operasional Lainnya', 'Jasa pengiriman dokumen/kuesioner/paket survei serta pembayaran premi asuransi perlindungan kerja petugas (BPJS Ketenagakerjaan)')
  ON CONFLICT (kode_akun) DO UPDATE SET nama_akun = EXCLUDED.nama_akun, deskripsi = EXCLUDED.deskripsi
  RETURNING id
)
INSERT INTO public.master_syarat (master_akun_id, nama_syarat, is_wajib, urutan)
SELECT akun.id, s.nama, s.wajib, s.urut FROM akun
CROSS JOIN (VALUES
  ('Identifikasi Kebutuhan & Form Perencanaan', true, 1),
  ('Kerangka Acuan Kerja (KAK) & Form Permintaan / Nota Dinas', true, 2),
  ('Kuitansi Pembayaran Bermaterai & Nota Pembelian Asli', true, 3),
  ('Surat Tanda Terima (STT) Ekspedisi & BAST Jasa Pengiriman', true, 4),
  ('Faktur Pajak & Bukti Setor Pajak (SSP PPN 11% & PPh 23 2%)', true, 5),
  ('Daftar Nama Peserta & Bukti Bayar Tagihan Premi BPJS Ketenagakerjaan (bila asuransi)', false, 6)
) AS s(nama, wajib, urut)
ON CONFLICT DO NOTHING;

-- 4. Belanja Non Operasional - Mitigasi / APD (521241)
WITH akun AS (
  INSERT INTO public.master_akun (kode_akun, nama_akun, deskripsi)
  VALUES ('521241', 'Belanja Non Operasional - Mitigasi / APD', 'Pengadaan perlengkapan Alat Pelindung Diri (APD), masker, hand sanitizer, dan kit kesehatan petugas sensus/survei di lapangan')
  ON CONFLICT (kode_akun) DO UPDATE SET nama_akun = EXCLUDED.nama_akun, deskripsi = EXCLUDED.deskripsi
  RETURNING id
)
INSERT INTO public.master_syarat (master_akun_id, nama_syarat, is_wajib, urutan)
SELECT akun.id, s.nama, s.wajib, s.urut FROM akun
CROSS JOIN (VALUES
  ('Identifikasi Kebutuhan & Surat Penetapan Perencanaan', true, 1),
  ('Kerangka Acuan Kerja (KAK) & Form Permintaan ke PPK', true, 2),
  ('Kuitansi Bermaterai & Nota Pembelian Toko', true, 3),
  ('Daftar Tanda Terima Alokasi APD kepada Petugas Lapangan', true, 4),
  ('Faktur Pajak & Bukti Setor Pajak (SSP PPN & PPh 22 bila > 2 juta)', true, 5),
  ('Foto Dokumentasi Fisik Penerimaan APD / Kit Kesehatan', false, 6)
) AS s(nama, wajib, urut)
ON CONFLICT DO NOTHING;

-- 5. Belanja Persediaan Barang Konsumsi (521811)
WITH akun AS (
  INSERT INTO public.master_akun (kode_akun, nama_akun, deskripsi)
  VALUES ('521811', 'Belanja Persediaan Barang Konsumsi', 'Pengadaan ATK perkantoran rutin, barang cetakan survei, toner printer, dan perlengkapan komputer (computer supplies)')
  ON CONFLICT (kode_akun) DO UPDATE SET nama_akun = EXCLUDED.nama_akun, deskripsi = EXCLUDED.deskripsi
  RETURNING id
)
INSERT INTO public.master_syarat (master_akun_id, nama_syarat, is_wajib, urutan)
SELECT akun.id, s.nama, s.wajib, s.urut FROM akun
CROSS JOIN (VALUES
  ('Identifikasi Kebutuhan & Form Perencanaan Barang Persediaan', true, 1),
  ('Surat Penetapan Perencanaan & KAK Pengadaan', true, 2),
  ('Form Permintaan / Nota Dinas (SM ke PPK)', true, 3),
  ('Kuitansi Bermaterai & Nota Rincian Pembelian Toko', true, 4),
  ('Faktur Pajak & SSP PPN (11%) / PPh 22 (1,5%)', true, 5),
  ('Berita Acara Serah Terima (BAST) Barang Persediaan', true, 6),
  ('Daftar Alokasi / Tanda Terima Pendistribusian ATK', true, 7)
) AS s(nama, wajib, urut)
ON CONFLICT DO NOTHING;

-- 6. Belanja Sewa (522141)
WITH akun AS (
  INSERT INTO public.master_akun (kode_akun, nama_akun, deskripsi)
  VALUES ('522141', 'Belanja Sewa', 'Pembiayaan sewa gudang penyimpanan dokumen sensus/survei dan sewa ruangan/gedung non-hotel')
  ON CONFLICT (kode_akun) DO UPDATE SET nama_akun = EXCLUDED.nama_akun, deskripsi = EXCLUDED.deskripsi
  RETURNING id
)
INSERT INTO public.master_syarat (master_akun_id, nama_syarat, is_wajib, urutan)
SELECT akun.id, s.nama, s.wajib, s.urut FROM akun
CROSS JOIN (VALUES
  ('Identifikasi Kebutuhan, Form Perencanaan & KAK Sewa', true, 1),
  ('Form Permintaan / Nota Dinas ke PPK', true, 2),
  ('Surat Perjanjian Kerja (SPK) / Kontrak Perjanjian Sewa', true, 3),
  ('Berita Acara Serah Terima Hasil Pekerjaan (BASTHP)', true, 4),
  ('Fotokopi NPWP & Rekening Koran / Buku Tabungan Pemilik Sewa', true, 5),
  ('Kuesioner Kelayakan Sewa Gudang (TTD PPK & Kepala Satker)', true, 6),
  ('Invoice, Kuitansi Pembayaran, & Berita Acara Pembayaran (BAP)', true, 7),
  ('Faktur Pajak & Bukti Setor SSP PPh Final Pasal 4 ayat 2 (10%)', true, 8)
) AS s(nama, wajib, urut)
ON CONFLICT DO NOTHING;

-- 7. Belanja Jasa Profesi (522151)
WITH akun AS (
  INSERT INTO public.master_akun (kode_akun, nama_akun, deskripsi)
  VALUES ('522151', 'Belanja Jasa Profesi', 'Honorarium narasumber, pakar, moderator, atau instruktur keahlian khusus eksternal BPS')
  ON CONFLICT (kode_akun) DO UPDATE SET nama_akun = EXCLUDED.nama_akun, deskripsi = EXCLUDED.deskripsi
  RETURNING id
)
INSERT INTO public.master_syarat (master_akun_id, nama_syarat, is_wajib, urutan)
SELECT akun.id, s.nama, s.wajib, s.urut FROM akun
CROSS JOIN (VALUES
  ('Identifikasi Kebutuhan, Perencanaan & KAK Jasa Profesi', true, 1),
  ('Form Permintaan / Nota Dinas ke PPK', true, 2),
  ('SK KPA tentang Belanja Jasa Profesi (Nama, Golongan, Rate Honor)', true, 3),
  ('Surat Undangan Resmi Narasumber/Moderator & Jadwal Acara', true, 4),
  ('Daftar Kehadiran Narasumber / Moderator bertandatangan basah', true, 5),
  ('Fotokopi NPWP & Fotokopi Rekening Koran / Buku Tabungan Aktif', true, 6),
  ('Kuitansi Belanja Jasa Profesi & SSP PPh 21 bertandatangan Bendahara', true, 7),
  ('Bahan Tayang Paparan / Materi Slide Presentasi / Notulensi Tanya Jawab', true, 8),
  ('Dokumentasi Foto Paparan & Curriculum Vitae (CV) Narasumber', true, 9)
) AS s(nama, wajib, urut)
ON CONFLICT DO NOTHING;

-- 8. Belanja Jasa Lainnya (522191)
WITH akun AS (
  INSERT INTO public.master_akun (kode_akun, nama_akun, deskripsi)
  VALUES ('522191', 'Belanja Jasa Lainnya', 'Pengadaan jasa publisitas kegiatan sensus/survei (media cetak/elektronik, radio, videotron, baliho, sosialisasi)')
  ON CONFLICT (kode_akun) DO UPDATE SET nama_akun = EXCLUDED.nama_akun, deskripsi = EXCLUDED.deskripsi
  RETURNING id
)
INSERT INTO public.master_syarat (master_akun_id, nama_syarat, is_wajib, urutan)
SELECT akun.id, s.nama, s.wajib, s.urut FROM akun
CROSS JOIN (VALUES
  ('Identifikasi Kebutuhan, Perencanaan & KAK Jasa Publisitas', true, 1),
  ('Form Permintaan / Nota Dinas (SM ke PPK)', true, 2),
  ('Surat Perjanjian Kerja (SPK) / Kontrak Kerja Pengadaan Publisitas', true, 3),
  ('Kuitansi Bermaterai & Nota Pembelian / Bukti Tagihan Penyedia', true, 4),
  ('Berita Acara Serah Terima (BAST) Hasil Pekerjaan Publisitas', true, 5),
  ('Faktur Pajak & Bukti Setor Pajak (SSP PPN 11% & PPh 23 2%)', true, 6),
  ('Dokumentasi Fisik Bukti Tayang (Kliping Koran / Foto Baliho / Video Rekaman)', true, 7)
) AS s(nama, wajib, urut)
ON CONFLICT DO NOTHING;

-- 9. Belanja Perjalanan Dinas Biasa (524111)
WITH akun AS (
  INSERT INTO public.master_akun (kode_akun, nama_akun, deskripsi)
  VALUES ('524111', 'Belanja Perjalanan Dinas Biasa', 'Perjalanan dinas luar kota, supervisi pimpinan/tim BPS Provinsi/Pusat, rapat koordinasi luar daerah')
  ON CONFLICT (kode_akun) DO UPDATE SET nama_akun = EXCLUDED.nama_akun, deskripsi = EXCLUDED.deskripsi
  RETURNING id
)
INSERT INTO public.master_syarat (master_akun_id, nama_syarat, is_wajib, urutan)
SELECT akun.id, s.nama, s.wajib, s.urut FROM akun
CROSS JOIN (VALUES
  ('Kerangka Acuan Kerja (KAK) & Form Permintaan / Nota Dinas', true, 1),
  ('Surat Tugas (Surtu) resmi bertandatangan Kepala BPS / KPA', true, 2),
  ('Surat Perjalanan Dinas (SPD) Lembar I & II bertandatangan & cap basah (Visum)', true, 3),
  ('Tiket & Boarding Pass Asli (Pesawat / Kereta / Travel Umum)', true, 4),
  ('Bukti Penginapan Riil (Billing Hotel) atau Surat Pernyataan Tidak Menginap 30%', true, 5),
  ('Daftar Rincian Biaya Perjalanan Dinas & Kuitansi Perjadin', true, 6),
  ('Daftar Pengeluaran Riil (DPR) Transportasi Lokal / Taksi Bandara', true, 7),
  ('Rekapitulasi Perjalanan Dinas Biasa (Bendahara)', true, 8),
  ('Laporan Singkat Hasil Pelaksanaan Perjadin & Dokumentasi Foto', true, 9)
) AS s(nama, wajib, urut)
ON CONFLICT DO NOTHING;

-- 10. Belanja Perjalanan Dinas Dalam Kota (524113)
WITH akun AS (
  INSERT INTO public.master_akun (kode_akun, nama_akun, deskripsi)
  VALUES ('524113', 'Belanja Perjalanan Dinas Dalam Kota', 'Transport lokal petugas pendataan lapangan, transport pengawasan/supervisi kab/kota, transport daerah sulit')
  ON CONFLICT (kode_akun) DO UPDATE SET nama_akun = EXCLUDED.nama_akun, deskripsi = EXCLUDED.deskripsi
  RETURNING id
)
INSERT INTO public.master_syarat (master_akun_id, nama_syarat, is_wajib, urutan)
SELECT akun.id, s.nama, s.wajib, s.urut FROM akun
CROSS JOIN (VALUES
  ('Kerangka Acuan Kerja (KAK) & Form Permintaan / Nota Dinas', true, 1),
  ('Surat Tugas (Surtu) resmi bertandatangan Kepala BPS / Atasan Langsung', true, 2),
  ('Bukti Visum, Tanda Tangan & Cap Stempel dari Tempat yang Dikunjungi (Kades/Lurah/Responden)', true, 3),
  ('Surat Pernyataan Tidak Menggunakan Kendaraan Dinas', true, 4),
  ('Laporan Ringkas Hasil Pelaksanaan Perjalanan Dinas Dalam Kota', true, 5),
  ('Kuitansi / Daftar Tanda Terima Uang Transportasi Petugas bertandatangan', true, 6),
  ('Rekapitulasi Perjalanan Dinas Dalam Kota & Bukti Transfer Bank (CMS)', true, 7),
  ('Jadwal Rinci Pelaksanaan (khusus jika pelaksanaan > 8 jam)', false, 8)
) AS s(nama, wajib, urut)
ON CONFLICT DO NOTHING;

-- 11. Belanja Perjadin Paket Meeting Dalam Kota (524114)
WITH akun AS (
  INSERT INTO public.master_akun (kode_akun, nama_akun, deskripsi)
  VALUES ('524114', 'Belanja Perjadin Paket Meeting Dalam Kota', 'Penyelenggaraan pelatihan petugas sensus/survei paket Fullboard, Fullday, atau Halfday meeting di hotel dalam kota')
  ON CONFLICT (kode_akun) DO UPDATE SET nama_akun = EXCLUDED.nama_akun, deskripsi = EXCLUDED.deskripsi
  RETURNING id
)
INSERT INTO public.master_syarat (master_akun_id, nama_syarat, is_wajib, urutan)
SELECT akun.id, s.nama, s.wajib, s.urut FROM akun
CROSS JOIN (VALUES
  ('Kerangka Acuan Kerja (KAK) & Form Permintaan / Nota Dinas', true, 1),
  ('Surat Pernyataan PJ Kegiatan bahwa Fasilitas Aula/Ruang Kantor Tidak Mencukupi', true, 2),
  ('Surat Undangan Kegiatan & Jadwal Acara (Fullboard / Fullday min 8 jam / Halfday min 5 jam)', true, 3),
  ('Surat Tugas & Daftar Hadir Peserta Lengkap Setiap Hari', true, 4),
  ('Notulensi / Laporan Pelaksanaan Kegiatan & Dokumentasi Foto', true, 5),
  ('SPD Paket Meeting Dalam Kota & Pernyataan Tidak Menggunakan Kendaraan Dinas', true, 6),
  ('Daftar Rincian Perhitungan Pembayaran Paket Meeting & Transport Peserta', true, 7),
  ('Roomlist / Daftar Pembagian Kamar Hotel Dilegalisasi Pihak Hotel (khusus Fullboard)', true, 8),
  ('Kuitansi Pembayaran Hotel, Faktur Pajak & SSP PPh 23', true, 9)
) AS s(nama, wajib, urut)
ON CONFLICT DO NOTHING;

-- 12. Belanja Perjadin Paket Meeting Luar Kota (524119)
WITH akun AS (
  INSERT INTO public.master_akun (kode_akun, nama_akun, deskripsi)
  VALUES ('524119', 'Belanja Perjadin Paket Meeting Luar Kota', 'Penyelenggaraan paket meeting / konsinyering pelatihan petugas di hotel luar kota (bila fasilitas hotel dalam kota tidak mencukupi)')
  ON CONFLICT (kode_akun) DO UPDATE SET nama_akun = EXCLUDED.nama_akun, deskripsi = EXCLUDED.deskripsi
  RETURNING id
)
INSERT INTO public.master_syarat (master_akun_id, nama_syarat, is_wajib, urutan)
SELECT akun.id, s.nama, s.wajib, s.urut FROM akun
CROSS JOIN (VALUES
  ('Kerangka Acuan Kerja (KAK) & Form Permintaan ke PPK', true, 1),
  ('Surat Pernyataan PJ Kegiatan bahwa Fasilitas Kantor & Hotel Dalam Kota Tidak Mencukupi', true, 2),
  ('Surat Tugas Resmi & SPD Perjalanan Dinas Luar Kota', true, 3),
  ('Berita Acara Pemeriksaan Pekerjaan (BAPP) & BASTHP', true, 4),
  ('Fotokopi NPWP & Rekening Koran / Buku Tabungan Penyedia Hotel', true, 5),
  ('Invoice, Kuitansi Hotel Bermaterai, & Berita Acara Pembayaran (BAP)', true, 6),
  ('Surat Undangan, Daftar Hadir Peserta Lengkap, & Jadwal Acara per Hari', true, 7),
  ('Laporan Hasil Pelaksanaan Kegiatan & Dokumentasi Foto Lengkap', true, 8),
  ('Roomlist / Daftar Kamar Hotel Asli Dilegalisasi Pihak Hotel', true, 9),
  ('Faktur Pajak & Bukti Setor Pajak (SSP PPh 23)', true, 10)
) AS s(nama, wajib, urut)
ON CONFLICT DO NOTHING;

