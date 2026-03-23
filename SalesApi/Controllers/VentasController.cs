using Microsoft.AspNetCore.Mvc;
using SalesApi.Models;

namespace SalesApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VentasController : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<Venta>> GetVentas()
    {
        var ventas = new List<Venta>
        {
            new Venta { Id = 1, Producto = "Leche 1L", Categoria = "Lácteos", Precio = 25.50m, Cantidad = 2, Fecha = DateTime.Now.AddDays(-1) },
            new Venta { Id = 2, Producto = "Pan Integral", Categoria = "Abarrotes", Precio = 45.00m, Cantidad = 1, Fecha = DateTime.Now.AddDays(-1) },
            new Venta { Id = 3, Producto = "Refresco 2L", Categoria = "Bebidas", Precio = 32.00m, Cantidad = 3, Fecha = DateTime.Now },
            new Venta { Id = 4, Producto = "Queso Fresco", Categoria = "Lácteos", Precio = 65.00m, Cantidad = 1, Fecha = DateTime.Now },
            new Venta { Id = 5, Producto = "Arroz 1kg", Categoria = "Abarrotes", Precio = 22.00m, Cantidad = 5, Fecha = DateTime.Now.AddDays(-2) }
        };

        return Ok(ventas);
    }
}