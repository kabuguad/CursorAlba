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
            .UseSqlServer(configurationRoot.GetConnectionString("sqlConnection"),
                sqlServerDbContextOptionsBuilder => sqlServerDbContextOptionsBuilder.MigrationsAssembly("AlbaApi"));
        return new RepositoryContext(dbContextOptionsBuilder.Options);
    }
}