using Microsoft.EntityFrameworkCore;
using SalesApi.Models;

namespace SalesApi.Data;

public class DataContext: DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options){}

    public DbSet<Venta> Ventas { get; set;}
}