var builder = WebApplication.CreateBuilder(args);

#if DEBUG
var MyCORS = "MyCORS";
builder.Services.AddCors(options =>
{
  options.AddPolicy(name: MyCORS,
  policy =>
  {
    policy.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader();
  });
});
#endif

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

#if DEBUG
app.UseCors(MyCORS);
#endif

app.UseDefaultFiles();
app.UseStaticFiles();

var api = app.MapGroup("/api");
{
  // API
  api.MapGet("/img2excel/{key}", Img2Excel.Get);
  api.MapPost("/img2excel", Img2Excel.Create);

  // イロイロテストしたい時用
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
