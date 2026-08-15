export interface CityShipping {
    name: string;
    cost: number;
    estimate: string;
}

export interface ProvinceShipping {
    name: string;
    defaultCost: number;
    defaultEstimate: string;
    cities: CityShipping[];
}

export const INDONESIA_SHIPPING_DATA: ProvinceShipping[] = [
    {
        name: "DKI Jakarta",
        defaultCost: 15000,
        defaultEstimate: "1-2 hari kerja",
        cities: [
            { name: "Jakarta Pusat", cost: 15000, estimate: "1-2 hari" },
            { name: "Jakarta Selatan", cost: 15000, estimate: "1-2 hari" },
            { name: "Jakarta Barat", cost: 15000, estimate: "1-2 hari" },
            { name: "Jakarta Timur", cost: 15000, estimate: "1-2 hari" },
            { name: "Jakarta Utara", cost: 15000, estimate: "1-2 hari" },
            { name: "Kepulauan Seribu", cost: 20000, estimate: "2-3 hari" },
        ],
    },
    {
        name: "Banten",
        defaultCost: 18000,
        defaultEstimate: "1-2 hari kerja",
        cities: [
            { name: "Kota Tangerang", cost: 15000, estimate: "1-2 hari" },
            { name: "Kota Tangerang Selatan", cost: 15000, estimate: "1-2 hari" },
            { name: "Kab. Tangerang", cost: 15000, estimate: "1-2 hari" },
            { name: "Kota Serang", cost: 18000, estimate: "1-2 hari" },
            { name: "Kab. Serang", cost: 18000, estimate: "2-3 hari" },
            { name: "Kota Cilegon", cost: 18000, estimate: "1-2 hari" },
            { name: "Kab. Lebak (Rangkasbitung)", cost: 20000, estimate: "2-3 hari" },
            { name: "Kab. Pandeglang", cost: 20000, estimate: "2-3 hari" },
        ],
    },
    {
        name: "Jawa Barat",
        defaultCost: 18000,
        defaultEstimate: "1-3 hari kerja",
        cities: [
            { name: "Kota Bandung", cost: 18000, estimate: "1-2 hari" },
            { name: "Kab. Bandung", cost: 18000, estimate: "1-2 hari" },
            { name: "Kab. Bandung Barat", cost: 18000, estimate: "1-2 hari" },
            { name: "Kota Cimahi", cost: 18000, estimate: "1-2 hari" },
            { name: "Kota Bekasi", cost: 15000, estimate: "1-2 hari" },
            { name: "Kab. Bekasi", cost: 15000, estimate: "1-2 hari" },
            { name: "Kota Bogor", cost: 15000, estimate: "1-2 hari" },
            { name: "Kab. Bogor", cost: 15000, estimate: "1-2 hari" },
            { name: "Kota Depok", cost: 15000, estimate: "1-2 hari" },
            { name: "Kota Cirebon", cost: 18000, estimate: "1-2 hari" },
            { name: "Kab. Cirebon", cost: 18000, estimate: "2-3 hari" },
            { name: "Kota Sukabumi", cost: 18000, estimate: "1-2 hari" },
            { name: "Kab. Sukabumi", cost: 18000, estimate: "2-3 hari" },
            { name: "Kota Tasikmalaya", cost: 18000, estimate: "1-2 hari" },
            { name: "Kab. Tasikmalaya", cost: 20000, estimate: "2-3 hari" },
            { name: "Kab. Karawang", cost: 16000, estimate: "1-2 hari" },
            { name: "Kab. Purwakarta", cost: 18000, estimate: "1-2 hari" },
            { name: "Kab. Subang", cost: 18000, estimate: "2-3 hari" },
            { name: "Kab. Garut", cost: 18000, estimate: "2-3 hari" },
            { name: "Kab. Cianjur", cost: 18000, estimate: "2-3 hari" },
            { name: "Kab. Sumedang", cost: 18000, estimate: "2-3 hari" },
            { name: "Kab. Indramayu", cost: 18000, estimate: "2-3 hari" },
            { name: "Kab. Majalengka", cost: 18000, estimate: "2-3 hari" },
            { name: "Kab. Kuningan", cost: 18000, estimate: "2-3 hari" },
            { name: "Kab. Ciamis", cost: 18000, estimate: "2-3 hari" },
            { name: "Kota Banjar", cost: 18000, estimate: "2-3 hari" },
            { name: "Kab. Pangandaran", cost: 20000, estimate: "2-3 hari" },
        ],
    },
    {
        name: "Jawa Tengah",
        defaultCost: 22000,
        defaultEstimate: "2-3 hari kerja",
        cities: [
            { name: "Kota Semarang", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Semarang", cost: 22000, estimate: "2-3 hari" },
            { name: "Kota Surakarta (Solo)", cost: 22000, estimate: "2-3 hari" },
            { name: "Kota Magelang", cost: 22000, estimate: "2-3 hari" },
            { name: "Kota Pekalongan", cost: 22000, estimate: "2-3 hari" },
            { name: "Kota Salatiga", cost: 22000, estimate: "2-3 hari" },
            { name: "Kota Tegal", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Banyumas (Purwokerto)", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Kudus", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Jepara", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Pati", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Klaten", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Sukoharjo", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Cilacap", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Kebumen", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Brebes", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Batang", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Boyolali", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Demak", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Kendal", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Purbalingga", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Rembang", cost: 24000, estimate: "2-3 hari" },
            { name: "Kab. Sragen", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Temanggung", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Wonosobo", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Wonogiri", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Karanganyar", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Grobogan (Purwodadi)", cost: 24000, estimate: "2-3 hari" },
            { name: "Kab. Blora", cost: 24000, estimate: "2-3 hari" },
        ],
    },
    {
        name: "DI Yogyakarta",
        defaultCost: 22000,
        defaultEstimate: "2-3 hari kerja",
        cities: [
            { name: "Kota Yogyakarta", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Sleman", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Bantul", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Kulon Progo", cost: 22000, estimate: "2-3 hari" },
            { name: "Kab. Gunungkidul", cost: 24000, estimate: "2-4 hari" },
        ],
    },
    {
        name: "Jawa Timur",
        defaultCost: 25000,
        defaultEstimate: "2-3 hari kerja",
        cities: [
            { name: "Kota Surabaya", cost: 25000, estimate: "2-3 hari" },
            { name: "Kota Malang", cost: 25000, estimate: "2-3 hari" },
            { name: "Kab. Sidoarjo", cost: 25000, estimate: "2-3 hari" },
            { name: "Kab. Gresik", cost: 25000, estimate: "2-3 hari" },
            { name: "Kota Batu", cost: 25000, estimate: "2-3 hari" },
            { name: "Kota Kediri", cost: 25000, estimate: "2-3 hari" },
            { name: "Kab. Kediri", cost: 25000, estimate: "2-3 hari" },
            { name: "Kota Madiun", cost: 25000, estimate: "2-3 hari" },
            { name: "Kota Blitar", cost: 25000, estimate: "2-3 hari" },
            { name: "Kota Pasuruan", cost: 25000, estimate: "2-3 hari" },
            { name: "Kota Probolinggo", cost: 25000, estimate: "2-3 hari" },
            { name: "Kota Mojokerto", cost: 25000, estimate: "2-3 hari" },
            { name: "Kab. Jember", cost: 26000, estimate: "2-3 hari" },
            { name: "Kab. Banyuwangi", cost: 28000, estimate: "2-4 hari" },
            { name: "Kab. Bojonegoro", cost: 25000, estimate: "2-3 hari" },
            { name: "Kab. Lamongan", cost: 25000, estimate: "2-3 hari" },
            { name: "Kab. Tuban", cost: 25000, estimate: "2-3 hari" },
            { name: "Kab. Tulungagung", cost: 25000, estimate: "2-3 hari" },
            { name: "Kab. Jombang", cost: 25000, estimate: "2-3 hari" },
            { name: "Kab. Lumajang", cost: 26000, estimate: "2-3 hari" },
            { name: "Kab. Nganjuk", cost: 25000, estimate: "2-3 hari" },
            { name: "Kab. Ngawi", cost: 25000, estimate: "2-3 hari" },
            { name: "Kab. Pacitan", cost: 28000, estimate: "2-4 hari" },
            { name: "Kab. Ponorogo", cost: 26000, estimate: "2-3 hari" },
            { name: "Kab. Situbondo", cost: 28000, estimate: "2-3 hari" },
            { name: "Kab. Bangkalan (Madura)", cost: 26000, estimate: "2-3 hari" },
            { name: "Kab. Pamekasan (Madura)", cost: 28000, estimate: "2-4 hari" },
            { name: "Kab. Sampang (Madura)", cost: 28000, estimate: "2-4 hari" },
            { name: "Kab. Sumenep (Madura)", cost: 28000, estimate: "2-4 hari" },
        ],
    },
    {
        name: "Bali",
        defaultCost: 28000,
        defaultEstimate: "2-4 hari kerja",
        cities: [
            { name: "Kota Denpasar", cost: 28000, estimate: "2-3 hari" },
            { name: "Kab. Badung (Kuta/Canggu/Nusa Dua)", cost: 28000, estimate: "2-3 hari" },
            { name: "Kab. Gianyar (Ubud)", cost: 30000, estimate: "2-4 hari" },
            { name: "Kab. Tabanan", cost: 30000, estimate: "2-4 hari" },
            { name: "Kab. Buleleng (Singaraja)", cost: 32000, estimate: "3-4 hari" },
            { name: "Kab. Klungkung", cost: 32000, estimate: "3-4 hari" },
            { name: "Kab. Karangasem", cost: 32000, estimate: "3-4 hari" },
            { name: "Kab. Bangli", cost: 30000, estimate: "3-4 hari" },
            { name: "Kab. Jembrana (Negara)", cost: 32000, estimate: "3-4 hari" },
        ],
    },
    {
        name: "Sumatera Utara",
        defaultCost: 42000,
        defaultEstimate: "3-4 hari kerja",
        cities: [
            { name: "Kota Medan", cost: 40000, estimate: "2-3 hari" },
            { name: "Kota Binjai", cost: 42000, estimate: "3-4 hari" },
            { name: "Kota Pematangsiantar", cost: 44000, estimate: "3-4 hari" },
            { name: "Kab. Deli Serdang", cost: 42000, estimate: "3-4 hari" },
            { name: "Kota Tebing Tinggi", cost: 44000, estimate: "3-4 hari" },
            { name: "Kab. Karo (Berastagi)", cost: 45000, estimate: "3-5 hari" },
            { name: "Kota Padangsidimpuan", cost: 48000, estimate: "3-5 hari" },
            { name: "Kab. Asahan (Kisaran)", cost: 45000, estimate: "3-5 hari" },
            { name: "Kab. Labuhanbatu", cost: 48000, estimate: "3-5 hari" },
        ],
    },
    {
        name: "Sumatera Barat",
        defaultCost: 40000,
        defaultEstimate: "3-4 hari kerja",
        cities: [
            { name: "Kota Padang", cost: 38000, estimate: "2-3 hari" },
            { name: "Kota Bukittinggi", cost: 40000, estimate: "3-4 hari" },
            { name: "Kota Payakumbuh", cost: 40000, estimate: "3-4 hari" },
            { name: "Kota Pariaman", cost: 40000, estimate: "3-4 hari" },
            { name: "Kota Solok", cost: 40000, estimate: "3-4 hari" },
            { name: "Kab. Agam", cost: 42000, estimate: "3-5 hari" },
            { name: "Kab. Tanah Datar", cost: 42000, estimate: "3-5 hari" },
        ],
    },
    {
        name: "Riau",
        defaultCost: 38000,
        defaultEstimate: "3-4 hari kerja",
        cities: [
            { name: "Kota Pekanbaru", cost: 36000, estimate: "2-3 hari" },
            { name: "Kota Dumai", cost: 40000, estimate: "3-4 hari" },
            { name: "Kab. Kampar", cost: 40000, estimate: "3-5 hari" },
            { name: "Kab. Bengkalis", cost: 44000, estimate: "3-5 hari" },
            { name: "Kab. Siak", cost: 42000, estimate: "3-5 hari" },
            { name: "Kab. Indragiri Hilir", cost: 45000, estimate: "3-5 hari" },
        ],
    },
    {
        name: "Kepulauan Riau",
        defaultCost: 38000,
        defaultEstimate: "2-4 hari kerja",
        cities: [
            { name: "Kota Batam", cost: 35000, estimate: "2-3 hari" },
            { name: "Kota Tanjungpinang", cost: 38000, estimate: "3-4 hari" },
            { name: "Kab. Bintan", cost: 40000, estimate: "3-5 hari" },
            { name: "Kab. Karimun", cost: 42000, estimate: "3-5 hari" },
        ],
    },
    {
        name: "Sumatera Selatan",
        defaultCost: 34000,
        defaultEstimate: "2-4 hari kerja",
        cities: [
            { name: "Kota Palembang", cost: 30000, estimate: "2-3 hari" },
            { name: "Kota Prabumulih", cost: 34000, estimate: "3-4 hari" },
            { name: "Kota Lubuklinggau", cost: 36000, estimate: "3-4 hari" },
            { name: "Kab. Banyuasin", cost: 34000, estimate: "3-4 hari" },
            { name: "Kab. Ogan Ilir", cost: 34000, estimate: "3-4 hari" },
            { name: "Kab. Muara Enim", cost: 36000, estimate: "3-5 hari" },
        ],
    },
    {
        name: "Lampung",
        defaultCost: 26000,
        defaultEstimate: "2-3 hari kerja",
        cities: [
            { name: "Kota Bandar Lampung", cost: 24000, estimate: "1-2 hari" },
            { name: "Kota Metro", cost: 26000, estimate: "2-3 hari" },
            { name: "Kab. Lampung Selatan", cost: 26000, estimate: "2-3 hari" },
            { name: "Kab. Lampung Tengah", cost: 28000, estimate: "2-3 hari" },
            { name: "Kab. Pringsewu", cost: 28000, estimate: "2-3 hari" },
        ],
    },
    {
        name: "Jambi",
        defaultCost: 35000,
        defaultEstimate: "3-4 hari kerja",
        cities: [
            { name: "Kota Jambi", cost: 32000, estimate: "2-3 hari" },
            { name: "Kab. Muaro Jambi", cost: 35000, estimate: "3-4 hari" },
            { name: "Kab. Batanghari", cost: 36000, estimate: "3-4 hari" },
            { name: "Kota Sungai Penuh", cost: 40000, estimate: "3-5 hari" },
        ],
    },
    {
        name: "Bengkulu",
        defaultCost: 38000,
        defaultEstimate: "3-4 hari kerja",
        cities: [
            { name: "Kota Bengkulu", cost: 36000, estimate: "2-3 hari" },
            { name: "Kab. Rejang Lebong", cost: 40000, estimate: "3-4 hari" },
            { name: "Kab. Bengkulu Utara", cost: 42000, estimate: "3-5 hari" },
        ],
    },
    {
        name: "Kepulauan Bangka Belitung",
        defaultCost: 36000,
        defaultEstimate: "2-4 hari kerja",
        cities: [
            { name: "Kota Pangkalpinang", cost: 34000, estimate: "2-3 hari" },
            { name: "Kab. Bangka (Sungailiat)", cost: 36000, estimate: "2-4 hari" },
            { name: "Kab. Belitung (Tanjung Pandan)", cost: 36000, estimate: "2-4 hari" },
            { name: "Kab. Belitung Timur", cost: 38000, estimate: "3-5 hari" },
        ],
    },
    {
        name: "Aceh",
        defaultCost: 48000,
        defaultEstimate: "3-5 hari kerja",
        cities: [
            { name: "Kota Banda Aceh", cost: 45000, estimate: "3-4 hari" },
            { name: "Kota Lhokseumawe", cost: 48000, estimate: "3-5 hari" },
            { name: "Kota Langsa", cost: 48000, estimate: "3-5 hari" },
            { name: "Kab. Aceh Besar", cost: 48000, estimate: "3-5 hari" },
            { name: "Kab. Aceh Tengah (Takengon)", cost: 52000, estimate: "4-6 hari" },
        ],
    },
    {
        name: "Kalimantan Timur",
        defaultCost: 45000,
        defaultEstimate: "3-4 hari kerja",
        cities: [
            { name: "Kota Balikpapan", cost: 42000, estimate: "2-3 hari" },
            { name: "Kota Samarinda", cost: 42000, estimate: "2-3 hari" },
            { name: "Kota Bontang", cost: 46000, estimate: "3-4 hari" },
            { name: "Kab. Kutai Kartanegara (Tenggarong)", cost: 46000, estimate: "3-4 hari" },
            { name: "Kab. Berau", cost: 50000, estimate: "3-5 hari" },
        ],
    },
    {
        name: "Kalimantan Selatan",
        defaultCost: 42000,
        defaultEstimate: "3-4 hari kerja",
        cities: [
            { name: "Kota Banjarmasin", cost: 40000, estimate: "2-3 hari" },
            { name: "Kota Banjarbaru", cost: 40000, estimate: "2-3 hari" },
            { name: "Kab. Banjar (Martapura)", cost: 42000, estimate: "3-4 hari" },
            { name: "Kab. Tanah Bumbu", cost: 46000, estimate: "3-5 hari" },
        ],
    },
    {
        name: "Kalimantan Barat",
        defaultCost: 42000,
        defaultEstimate: "3-4 hari kerja",
        cities: [
            { name: "Kota Pontianak", cost: 38000, estimate: "2-3 hari" },
            { name: "Kota Singkawang", cost: 42000, estimate: "3-4 hari" },
            { name: "Kab. Kubu Raya", cost: 40000, estimate: "3-4 hari" },
            { name: "Kab. Sambas", cost: 45000, estimate: "3-5 hari" },
            { name: "Kab. Ketapang", cost: 46000, estimate: "3-5 hari" },
        ],
    },
    {
        name: "Kalimantan Tengah",
        defaultCost: 44000,
        defaultEstimate: "3-4 hari kerja",
        cities: [
            { name: "Kota Palangkaraya", cost: 40000, estimate: "2-3 hari" },
            { name: "Kab. Kotawaringin Timur (Sampit)", cost: 45000, estimate: "3-4 hari" },
            { name: "Kab. Kotawaringin Barat (Pangkalan Bun)", cost: 45000, estimate: "3-4 hari" },
            { name: "Kab. Kapuas", cost: 45000, estimate: "3-5 hari" },
        ],
    },
    {
        name: "Kalimantan Utara",
        defaultCost: 55000,
        defaultEstimate: "3-5 hari kerja",
        cities: [
            { name: "Kota Tarakan", cost: 52000, estimate: "3-4 hari" },
            { name: "Kab. Bulungan (Tanjung Selor)", cost: 56000, estimate: "3-5 hari" },
            { name: "Kab. Nunukan", cost: 60000, estimate: "4-6 hari" },
        ],
    },
    {
        name: "Sulawesi Selatan",
        defaultCost: 45000,
        defaultEstimate: "3-4 hari kerja",
        cities: [
            { name: "Kota Makassar", cost: 42000, estimate: "2-3 hari" },
            { name: "Kota Parepare", cost: 46000, estimate: "3-4 hari" },
            { name: "Kota Palopo", cost: 50000, estimate: "3-5 hari" },
            { name: "Kab. Gowa", cost: 44000, estimate: "3-4 hari" },
            { name: "Kab. Maros", cost: 44000, estimate: "3-4 hari" },
            { name: "Kab. Bone", cost: 50000, estimate: "3-5 hari" },
            { name: "Kab. Bulukumba", cost: 50000, estimate: "3-5 hari" },
        ],
    },
    {
        name: "Sulawesi Utara",
        defaultCost: 55000,
        defaultEstimate: "3-5 hari kerja",
        cities: [
            { name: "Kota Manado", cost: 52000, estimate: "2-4 hari" },
            { name: "Kota Bitung", cost: 55000, estimate: "3-4 hari" },
            { name: "Kota Tomohon", cost: 55000, estimate: "3-4 hari" },
            { name: "Kab. Minahasa", cost: 56000, estimate: "3-5 hari" },
            { name: "Kota Kotamobagu", cost: 58000, estimate: "3-5 hari" },
        ],
    },
    {
        name: "Sulawesi Tengah",
        defaultCost: 50000,
        defaultEstimate: "3-5 hari kerja",
        cities: [
            { name: "Kota Palu", cost: 48000, estimate: "3-4 hari" },
            { name: "Kab. Banggai (Luwuk)", cost: 52000, estimate: "3-5 hari" },
            { name: "Kab. Poso", cost: 54000, estimate: "3-5 hari" },
        ],
    },
    {
        name: "Sulawesi Tenggara",
        defaultCost: 52000,
        defaultEstimate: "3-5 hari kerja",
        cities: [
            { name: "Kota Kendari", cost: 50000, estimate: "3-4 hari" },
            { name: "Kota Baubau", cost: 52000, estimate: "3-5 hari" },
            { name: "Kab. Kolaka", cost: 55000, estimate: "3-5 hari" },
        ],
    },
    {
        name: "Gorontalo",
        defaultCost: 52000,
        defaultEstimate: "3-5 hari kerja",
        cities: [
            { name: "Kota Gorontalo", cost: 50000, estimate: "3-4 hari" },
            { name: "Kab. Gorontalo", cost: 52000, estimate: "3-5 hari" },
        ],
    },
    {
        name: "Sulawesi Barat",
        defaultCost: 54000,
        defaultEstimate: "3-5 hari kerja",
        cities: [
            { name: "Kab. Mamuju", cost: 52000, estimate: "3-5 hari" },
            { name: "Kab. Polewali Mandar", cost: 54000, estimate: "3-5 hari" },
        ],
    },
    {
        name: "Nusa Tenggara Barat",
        defaultCost: 40000,
        defaultEstimate: "3-4 hari kerja",
        cities: [
            { name: "Kota Mataram (Lombok)", cost: 38000, estimate: "2-3 hari" },
            { name: "Kab. Lombok Barat", cost: 40000, estimate: "3-4 hari" },
            { name: "Kab. Lombok Tengah (Praya)", cost: 40000, estimate: "3-4 hari" },
            { name: "Kota Bima (Sumbawa)", cost: 46000, estimate: "3-5 hari" },
            { name: "Kab. Sumbawa", cost: 45000, estimate: "3-5 hari" },
        ],
    },
    {
        name: "Nusa Tenggara Timur",
        defaultCost: 62000,
        defaultEstimate: "4-6 hari kerja",
        cities: [
            { name: "Kota Kupang", cost: 58000, estimate: "3-5 hari" },
            { name: "Kab. Manggarai Barat (Labuan Bajo)", cost: 60000, estimate: "3-5 hari" },
            { name: "Kab. Ende", cost: 64000, estimate: "4-6 hari" },
            { name: "Kab. Sikka (Maumere)", cost: 64000, estimate: "4-6 hari" },
            { name: "Kab. Alor", cost: 70000, estimate: "4-7 hari" },
        ],
    },
    {
        name: "Maluku",
        defaultCost: 70000,
        defaultEstimate: "4-6 hari kerja",
        cities: [
            { name: "Kota Ambon", cost: 68000, estimate: "3-5 hari" },
            { name: "Kota Tual", cost: 75000, estimate: "4-7 hari" },
            { name: "Kab. Maluku Tengah", cost: 75000, estimate: "4-7 hari" },
        ],
    },
    {
        name: "Maluku Utara",
        defaultCost: 70000,
        defaultEstimate: "4-6 hari kerja",
        cities: [
            { name: "Kota Ternate", cost: 68000, estimate: "3-5 hari" },
            { name: "Kota Tidore Kepulauan", cost: 70000, estimate: "4-6 hari" },
            { name: "Kab. Halmahera Utara", cost: 75000, estimate: "4-7 hari" },
        ],
    },
    {
        name: "Papua",
        defaultCost: 85000,
        defaultEstimate: "4-7 hari kerja",
        cities: [
            { name: "Kota Jayapura", cost: 82000, estimate: "3-5 hari" },
            { name: "Kab. Jayapura (Sentani)", cost: 85000, estimate: "4-6 hari" },
            { name: "Kab. Biak Numfor", cost: 88000, estimate: "4-6 hari" },
            { name: "Kab. Keerom", cost: 90000, estimate: "4-7 hari" },
        ],
    },
    {
        name: "Papua Barat & PBD",
        defaultCost: 82000,
        defaultEstimate: "4-7 hari kerja",
        cities: [
            { name: "Kota Sorong", cost: 78000, estimate: "3-5 hari" },
            { name: "Kab. Manokwari", cost: 82000, estimate: "4-6 hari" },
            { name: "Kab. Fakfak", cost: 88000, estimate: "4-7 hari" },
            { name: "Kab. Raja Ampat", cost: 95000, estimate: "5-8 hari" },
        ],
    },
    {
        name: "Papua Tengah & Selatan",
        defaultCost: 92000,
        defaultEstimate: "4-7 hari kerja",
        cities: [
            { name: "Kab. Mimika (Timika)", cost: 90000, estimate: "4-6 hari" },
            { name: "Kab. Merauke", cost: 95000, estimate: "4-7 hari" },
            { name: "Kab. Nabire", cost: 92000, estimate: "4-7 hari" },
        ],
    },
];

export function getShippingRate(provinceName: string, cityName?: string): { cost: number; estimate: string } {
    if (!provinceName) {
        return { cost: 15000, estimate: "1-2 hari kerja" };
    }

    const province = INDONESIA_SHIPPING_DATA.find(
        (p) => p.name.toLowerCase() === provinceName.toLowerCase()
    );

    if (!province) {
        return { cost: 40000, estimate: "3-5 hari kerja" };
    }

    if (cityName) {
        const city = province.cities.find(
            (c) => c.name.toLowerCase() === cityName.toLowerCase()
        );
        if (city) {
            return { cost: city.cost, estimate: city.estimate };
        }
    }

    return { cost: province.defaultCost, estimate: province.defaultEstimate };
}
