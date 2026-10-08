# Frontend build
FROM node:24-alpine AS frontend
WORKDIR /src/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

# Empty = the React app calls /api/... on the same address it was served from.
ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Backend build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend
WORKDIR /src

COPY backend/RigForgeSolution/RigForge/RigForge.csproj RigForge/
RUN dotnet restore RigForge/RigForge.csproj

COPY backend/RigForgeSolution/ .
RUN dotnet publish RigForge/RigForge.csproj -c Release -o /app --no-restore /p:UseAppHost=false

# Run
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# The host routes traffic to this port and terminates HTTPS at its proxy.
ENV ASPNETCORE_HTTP_PORTS=10000 \
    ASPNETCORE_ENVIRONMENT=Production \
    DOTNET_gcServer=0

COPY --from=backend /app .

# The React build, served by the API (see Program.cs). Kept outside wwwroot so a
# persistent disk mounted on wwwroot for uploads does not hide it.
COPY --from=frontend /src/frontend/dist ./client

# Uploaded build images are written here.
RUN mkdir -p /app/wwwroot && chown -R $APP_UID /app/wwwroot

EXPOSE 10000

USER $APP_UID

ENTRYPOINT ["dotnet", "RigForge.dll"]
