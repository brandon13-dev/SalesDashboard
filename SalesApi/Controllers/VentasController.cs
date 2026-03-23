using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalesApi.Data;
using SalesApi.Models;

namespace SalesApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VentasController : ControllerBase
{
    private readonly DataContext _context;

    public VentasController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Venta>>> GetVentas()
    {
        return await _context.Ventas.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Venta>> PostVenta(Venta venta)
    {
        _context.Ventas.Add(venta);
        await _context.SaveChangesAsync();
        return Ok(venta);
    }
}