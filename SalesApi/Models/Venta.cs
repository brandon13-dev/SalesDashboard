namespace SalesApi.Models;

public class Venta
{
    public int Id { get; set;}
    public string Producto { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public decimal Precio { get; set; }
    public int Cantidad { get; set; }
    public DateTime Fecha { get; set; }

    // Propiedad calculada para el total
    public decimal Total => Precio * Cantidad;
}