var builder = WebApplication.CreateBuilder(args);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();

var api = app.MapGroup("/api");
{
  api.MapPost("/img2excel", Handler.Img2Excel);
  var debug = api.MapGroup("/debug");
  {
    debug.MapGet("/hello", () => "Hello GET!");
    debug.MapGet("/hello/{name}", (string name) => $"Hello GET {name}!");
    debug.MapPost("/hello", (string name) => $"Hello POST {name}!");
    debug.MapPut("/hello", (string name) => $"Hello PUT {name}!");
    debug.MapDelete("/hello", (string name) => $"Hello DELETE {name}!");
  }
}

app.UseRouting();

app.Run("http://+:80");
