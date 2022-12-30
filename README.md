# img2excel-server

画像ファイルをExcelファイルに変換するお遊びプログラムをWebサービスとしたもの。  
もとのプロジェクト(スタンドアロン用)は[こちら](https://github.com/osawa-koki/img2excel)。  

![成果物](./.development/img/fruit.gif)  

## 開発環境の構築

```shell
# サーバ
# 普通に実行(Visual Studioで)すると「http://+:80」をリッスン

# クライアント
yarn dev
# 「http://localhost:3000」をリッスン
```

これだけで、OK!  
Nodeの実行環境によって自動的に制御しているため、そのまま本番環境へデプロイ用すれば同様の結果が得られるハズ、、、  

## 実行方法

本番環境のDockerfileの動作確認。  

```shell
# Dockerfileのビルドの実行
docker build -t img2excel-server .
docker run -p 80:80 -it --rm --name my-img2excel-server img2excel-server

# 一行で書くと、、、
docker build -t img2excel-server . && docker run -p 80:80 -it --rm --name my-img2excel-server img2excel-server
```

## デプロイ設定(Render)

| キー | バリュー |
| ---- | ---- |
| Name | img2excel |
| Region | Oregon(US West) |
| Branch | main |
| Root Directory |  |
| Environment | Docker |
| Dockerfile Path | ./Dockerfile |
| Docker Build Context Directory |  |
| Docker Command |  |

## イロイロ

### Bitmap

[スタンドアロンプログラム](https://github.com/osawa-koki/img2excel)ではBitmapを使用していましたが、ここでは使用をやめました。  
.NET6.0からBitmapクラスは非推奨だからです。  

> .NET 6 以降のバージョンでは、この種類を含む System.Drawing.Common パッケージは Windows オペレーティング システムでのみサポートされています。 クロスプラットフォーム アプリでこの型を使用すると、コンパイル時の警告と実行時例外が発生します。 詳細については、「 Windows でのみサポートされる System.Drawing.Common」を参照してください。
> <https://learn.microsoft.com/ja-jp/dotnet/api/system.drawing.bitmap?view=dotnet-plat-ext-7.0>

簡単に説明するとWindows以外でも使用する場合には使うなということです。  
ここではDockerを使用することを全体としているため、代わりに[ImageSharp](https://sixlabors.com/products/imagesharp/)を使用しています。  

Bitmap以上に複雑な処理ができるので非常に便利です。  
