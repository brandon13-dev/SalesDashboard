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

    [HttpGet("filtrar")]
    public async Task<ActionResult<IEnumerable<Venta>>> GetVentasPorFecha(
        [FromQuery] DateTime inicio,
        [FromQuery] DateTime fin
    )
    {
        var ventasFiltradas = await _context.Ventas.Where(v => v.Fecha.Date >= inicio.Date && v.Fecha.Date <= fin.Date).OrderByDescending(v => v.Fecha).ToListAsync();

        return Ok(ventasFiltradas);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVenta(int id){
        var venta = await _context.Ventas.FindAsync(id);
        if(venta == null) return NotFound();

        _context.Ventas.Remove(venta);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutVenta(int id, Venta venta)
    {
        if(id != venta.Id) return BadRequest();

        _context.Entry(venta).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Ventas.Any(e => e.Id == id)) return NotFound();
            else throw;
        }
        return NoContent();
    }
}