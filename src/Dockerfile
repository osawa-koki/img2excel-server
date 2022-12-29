#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["src/img2excel-server.csproj", "src/"]
RUN dotnet restore "src/img2excel-server.csproj"
COPY . .
WORKDIR "/src/src"
RUN dotnet build "img2excel-server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "img2excel-server.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "img2excel-server.dll"]