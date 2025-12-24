export default function ProductCard() {
  return (
    <div className="w-full p-5 flex flex-col items-center justify-center gap-5 rounded-xl border">
      <div className="w-full flex items-center justify-center aspect-square rounded-xl border">
        <p>Nanti ini gambar produknya</p>
      </div>
      <div className="w-full flex flex-col gap-2">
        <h1>Nanti ini nama produk</h1>
        <p>Nanti ini deskripsi produk</p>
        <p>Nanti ini harga produk</p>
      </div>
    </div>
  );
}
