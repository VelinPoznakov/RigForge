using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RigForge.Models;

namespace RigForge.Data.Configurations;

public class BuildConfiguration : IEntityTypeConfiguration<Build>
{
    public void Configure(EntityTypeBuilder<Build> builder)
    {
        builder
            .HasOne(b => b.Owner)
            .WithMany(u => u.Builds)
            .HasForeignKey(b => b.OwnerId);
    }
}
