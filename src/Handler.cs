
// https://learn.microsoft.com/ja-jp/aspnet/core/fundamentals/minimal-apis?view=aspnetcore-7.0

using ClosedXML.Excel;
using DocumentFormat.OpenXml.Office2016.Excel;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using System.IO;
using System.Security.Cryptography;

internal static class Handler
{
  const int maximumImageSize = 100_000;
  private static readonly MD5 hasher = MD5.Create();
  private static readonly List<string> cache = new();

  async internal static Task Img2Excel(HttpRequest request, HttpResponse response)
  {

    var bytes = new byte[maximumImageSize];
    var length = await request.Body.ReadAsync(bytes, 0, maximumImageSize);
    var imageBytes = bytes[..length];

    // サイズチェック
    if (imageBytes.Length == maximumImageSize)
    {
      response.StatusCode = 413;
      await response.WriteAsync("Image size is too large.");
      return;
    }


    // 受け取ったバイト配列のハッシュ値を計算
    var hashed = hasher.ComputeHash(imageBytes);
    var hash = BitConverter.ToString(hashed).Replace("-", "");

    string? fileName = null;

    // キャッシュにハッシュ値が存在するか確認
    if (cache.Contains(hash))
    {
      fileName = $"{hash[..8]}.xlsx";
    }

    // キャッシュに存在しなければ画像を解析してキャッシュに追加
    else
    {
      // Excelブックを作成する。
      XLWorkbook book = new();

      using Image<Rgba32> image = (Image<Rgba32>)SixLabors.ImageSharp.Image.Load(imageBytes);

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
          string hex = color.ToHex();
          sheet.Cell(y, x).Style.Fill.BackgroundColor = XLColor.FromHtml($"#{hex}");
        }
      }

      // Excelブックを保存保存する。
      book.SaveAs($"./.cache/{hash}.xlsx");
    }


  }
}
