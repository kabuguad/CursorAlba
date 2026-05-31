using Microsoft.EntityFrameworkCore.Design;
using Repository;
using Microsoft.EntityFrameworkCore;


namespace AlbaApi.ContextFactory;

public class RepositoryContextFactory : IDesignTimeDbContextFactory<RepositoryContext>
{
    public RepositoryContext CreateDbContext(string[] args)
    {
        var configurationRoot = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();
        var dbContextOptionsBuilder = new DbContextOptionsBuilder<RepositoryContext>()
            .UseSqlite(configurationRoot.GetConnectionString("sqlConnection"),
                sqliteDbContextOptionsBuilder => sqliteDbContextOptionsBuilder.MigrationsAssembly("AlbaApi"));
        return new RepositoryContext(dbContextOptionsBuilder.Options);
    }
}
