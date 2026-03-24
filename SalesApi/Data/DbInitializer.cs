using SalesApi.Models;

namespace SalesApi.Data;

public static class DbInitilizer
{
    public static void Seed(DataContext context)
    {
        // si ya existen registros no hacemos nada
        if(context.Ventas.Any()) return;

        // datos de prueba por si no hay registros
        var ventasSemilla = new List<Venta>
        {
            new Venta { Producto = "Leche Entera 1L", Categoria = "Lácteos", Precio = 26.50m, Cantidad = 5, Fecha = DateTime.Now.AddDays(-3) },
            new Venta { Producto = "Huevo 12 pz", Categoria = "Abarrotes", Precio = 42.00m, Cantidad = 2, Fecha = DateTime.Now.AddDays(-2) },
            new Venta { Producto = "Coca-Cola 2.5L", Categoria = "Bebidas", Precio = 35.00m, Cantidad = 10, Fecha = DateTime.Now.AddDays(-2) },
            new Venta { Producto = "Pan de Caja", Categoria = "Abarrotes", Precio = 48.00m, Cantidad = 3, Fecha = DateTime.Now.AddDays(-1) },
            new Venta { Producto = "Queso Panela", Categoria = "Lácteos", Precio = 65.00m, Cantidad = 1, Fecha = DateTime.Now.AddDays(-1) },
            new Venta { Producto = "Detergente 1kg", Categoria = "Limpieza", Precio = 38.50m, Cantidad = 4, Fecha = DateTime.Now },
            new Venta { Producto = "Agua Mineral 600ml", Categoria = "Bebidas", Precio = 15.00m, Cantidad = 15, Fecha = DateTime.Now }
        };

        context.Ventas.AddRange(ventasSemilla);
        context.SaveChanges();
    }
}