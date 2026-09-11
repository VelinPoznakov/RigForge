using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RigForge.Models;

namespace RigForge.Data.Configurations;

public class BuildLikeConfiguration : IEntityTypeConfiguration<BuildLike>
{
    public void Configure(EntityTypeBuilder<BuildLike> builder)
    {
        builder
            .HasOne(l => l.Build)
            .WithMany(b => b.Likes)
            .HasForeignKey(l => l.BuildId);

        builder
            .HasOne(l => l.User)
            .WithMany(u => u.Likes)
            .HasForeignKey(l => l.UserId);
    }
}
