# Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY RigForge/RigForge.csproj RigForge/
RUN dotnet restore RigForge/RigForge.csproj

COPY . .
RUN dotnet publish RigForge/RigForge.csproj -c Release -o /app --no-restore /p:UseAppHost=false

# Run
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# The host routes traffic to this port and terminates HTTPS at its proxy.
ENV ASPNETCORE_HTTP_PORTS=10000 \
    ASPNETCORE_ENVIRONMENT=Production \
    DOTNET_gcServer=0

COPY --from=build /app .

# Uploaded build images are written here.
RUN mkdir -p /app/wwwroot && chown -R $APP_UID /app/wwwroot

EXPOSE 10000

USER $APP_UID

ENTRYPOINT ["dotnet", "RigForge.dll"]
