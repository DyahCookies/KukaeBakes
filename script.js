let troli = [];

function toggleTroli() {
    const modal = document.getElementById('troli-modal');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
        tampilkanTroli();
    }
}

function tambahKeTroli(namaKue, hargaKue) {
    const itemDitemukan = troli.find(item => item.nama === namaKue);
    
    if (itemDitemukan) {
        itemDitemukan.jumlah += 1;
    } else {
        troli.push({ nama: namaKue, harga: hargaKue, jumlah: 1 });
    }
    
    updateBadgeTroli();
    
    // Animasi mantul
    const tombolTroli = document.getElementById('btn-troli-melayang');
    tombolTroli.classList.add('animasi-mantul');
    setTimeout(() => {
        tombolTroli.classList.remove('animasi-mantul');
    }, 300);
}

// FUNGSI BARU: Mengubah jumlah barang (+/-)
function ubahJumlah(namaKue, perubahan) {
    const item = troli.find(i => i.nama === namaKue);
    if (item) {
        item.jumlah += perubahan;
        // Jika jumlah 0 atau kurang, hapus dari troli
        if (item.jumlah <= 0) {
            hapusItem(namaKue);
            return; // Hentikan eksekusi karena hapusItem sudah memanggil update & tampilkan
        }
    }
    updateBadgeTroli();
    tampilkanTroli();
}

// FUNGSI BARU: Menghapus barang sepenuhnya dari troli
function hapusItem(namaKue) {
    troli = troli.filter(item => item.nama !== namaKue);
    updateBadgeTroli();
    tampilkanTroli();
}

function updateBadgeTroli() {
    const totalItem = troli.reduce((acc, item) => acc + item.jumlah, 0);
    document.getElementById('cart-count').innerText = totalItem;
}

// DIPERBARUI: Menampilkan kontrol tombol di dalam troli
function tampilkanTroli() {
    const containerItem = document.getElementById('troli-items');
    const containerTotal = document.getElementById('troli-total-harga');
    
    if (troli.length === 0) {
        containerItem.innerHTML = '<p style="text-align: center; color: #aaa;">Troli masih kosong.</p>';
        containerTotal.innerText = 'Rp 0';
        return;
    }
    
    let htmlContent = '';
    let totalHargaSemua = 0;
    
    troli.forEach((item) => {
        const subTotal = item.harga * item.jumlah;
        totalHargaSemua += subTotal;
        
        htmlContent += `
            <div class="troli-item">
                <div>
                    <strong>${item.nama}</strong><br>
                    <small>Harga: Rp ${item.harga.toLocaleString('id-ID')}</small>
                    <div class="troli-controls">
                        <button class="btn-qty" onclick="ubahJumlah('${item.nama}', -1)">-</button>
                        <span>${item.jumlah}</span>
                        <button class="btn-qty" onclick="ubahJumlah('${item.nama}', 1)">+</button>
                        <button class="btn-hapus" onclick="hapusItem('${item.nama}')">Hapus</button>
                    </div>
                </div>
                <div style="padding-top: 10px;">
                    <span style="font-weight: 600; color: #7a5c78;">Rp ${subTotal.toLocaleString('id-ID')}</span>
                </div>
            </div>
        `;
    });
    
    containerItem.innerHTML = htmlContent;
    containerTotal.innerText = 'Rp ' + totalHargaSemua.toLocaleString('id-ID');
}

function checkoutWhatsApp() {
    if (troli.length === 0) {
        alert("Troli Anda masih kosong. Silakan pilih kue terlebih dahulu!");
        return;
    }
    
    const nomorWhatsApp = "6285772182367"; // Jangan lupa ganti dengan nomor aslimu
    
    let teksPesan = "Halo Kukae Bakes! Saya ingin memesan kue berikut:\n\n";
    let totalHargaSemua = 0;
    
    troli.forEach((item) => {
        const subTotal = item.harga * item.jumlah;
        totalHargaSemua += subTotal;
        teksPesan += `- ${item.jumlah}x ${item.nama} (Rp ${subTotal.toLocaleString('id-ID')})\n`;
    });
    
    teksPesan += `\n*Total Keseluruhan:* Rp ${totalHargaSemua.toLocaleString('id-ID')}\n\nMohon diproses ya, terima kasih!`;
    
    const pesanEncoded = encodeURIComponent(teksPesan);
    window.open("https://wa.me/" + nomorWhatsApp + "?text=" + pesanEncoded, "_blank");
}

window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 15px rgba(0,0,0,0.1)';
        navbar.style.padding = '15px 50px';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        navbar.style.padding = '20px 50px';
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// =========================================
// SISTEM ANIMASI FADE-IN SAAT SCROLL
// =========================================
const faders = document.querySelectorAll('.fade-in');

const appearOptions = {
    threshold: 0.15, // Animasi mulai saat 15% bagian elemen terlihat di layar
    rootMargin: "0px 0px -50px 0px" 
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('muncul');
            observer.unobserve(entry.target); // Hentikan observasi setelah elemen muncul
        }
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});