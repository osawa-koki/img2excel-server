
// https://learn.microsoft.com/ja-jp/aspnet/core/fundamentals/minimal-apis?view=aspnetcore-7.0

using ClosedXML.Excel;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using System.Security.Cryptography;

internal static class Img2Excel
{
  const int maximumImageSize = 1_000_000;
  private static readonly MD5 hasher = MD5.Create();
  private static readonly List<string> cache = new();
  
  async internal static Task<IResult> Create(HttpRequest request, HttpResponse response)
  {

    var bytes = new byte[maximumImageSize];
    var length = await request.Body.ReadAsync(bytes, 0, maximumImageSize);
    var imageBytes = bytes[..length];

    // サイズチェック
    if (imageBytes.Length == maximumImageSize)
    {
      response.StatusCode = 413;
      await response.WriteAsync("Image size is too large.");
      return await Task.FromResult<IResult>(Results.BadRequest());
    }


    // 受け取ったバイト配列のハッシュ値を計算
    var hashed = hasher.ComputeHash(imageBytes);
    var hash = BitConverter.ToString(hashed).Replace("-", "")[..8];

    string? fileName = $"{hash}.xlsx";
    
    // キャッシュにハッシュ値が存在するか確認
    if (cache.Contains(hash))
    {
      // それを使用する
    }

    // キャッシュに存在しなければ画像を解析してキャッシュに追加
    else
    {
      // Excelブックを作成する。
      XLWorkbook book = new();

      using Image<Rgba32> image = Image.Load<SixLabors.ImageSharp.PixelFormats.Rgba32>(imageBytes);

      // リサイズ処理
      // image.Mutate(x => x.Resize(image.Width / 2, image.Height / 2));

      var width = image.Width;
      var height = image.Height;

      // ファイル名を取得
      var sheet_name = Path.GetFileNameWithoutExtension(DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss"));

      // ワークシートを追加する。
      IXLWorksheet sheet = book.Worksheets.Add(sheet_name);

      // 行の高さをまとめて変更する。
      sheet.Rows(1, width).Height = 4.5;
      // 列の幅をまとめて変更する。
      sheet.Columns(1, height).Width = 0.1;

      for (int x = 1; x <= width; x++)
      {
        for (int y = 1; y <= height; y++)
        {
          Color color = image[x-1, y-1];
          string hex = color.ToHex()[..6];
          sheet.Cell(y, x).Style.Fill.BackgroundColor = XLColor.FromHtml($"#{hex}");
        }
      }

      // Excelブックを保存する。
      cache.Add(hash);
      book.SaveAs($"./wwwroot/.cache/{fileName}");
    }

    response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    response.Headers.Add("Content-Disposition", $"attachment; filename={fileName}");

    response.StatusCode = 201;
    response.Headers.Add("location", $"{(request.IsHttps ? "https" : "http")}{request.Host}/.cache/{fileName}");
    return Results.File($"./.cache/{fileName}");
  }

  internal static IResult Get(string key, HttpResponse response)
  {
    try
    {
      if (cache.Contains(key) == false)
      {
        return Results.NotFound();
      }

      response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      response.Headers.Add("Content-Disposition", $"attachment; filename={key}.xlsx");

      return Results.Ok(File.ReadAllBytes($"./.cache/{key}.xlsx"));
    } catch (Exception)
    {
      return Results.NotFound();
    }
  }
}
