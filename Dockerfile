FROM node:19-bullseye-slim AS web_client
WORKDIR /usr/src
COPY ./web_client ./web_client
RUN cd ./web_client && yarn install && yarn build

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ./src/img2excel-server.csproj .
RUN dotnet restore ./img2excel-server.csproj
COPY ./src .
WORKDIR /src
RUN dotnet build ./img2excel-server.csproj -c Release -o /app/build

FROM build AS publish
RUN dotnet publish img2excel-server.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=web_client /usr/src/web_client/dist ./wwwroot
ENTRYPOINT ["dotnet", "img2excel-server.dll"]
