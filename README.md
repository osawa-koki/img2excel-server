# img2excel-server

画像ファイルをExcelファイルに変換するお遊びプログラムをWebサービスとしたもの。  
もとのプロジェクト(スタンドアロン用)は[こちら](https://github.com/osawa-koki/img2excel)。  

## 実行方法

本番環境のDockerfileの動作確認。  

```shell
# Dockerfileのビルドの実行
docker build -t img2excel-server .
docker run -p 80:80 -it --rm --name my-img2excel-server img2excel-server

# 一行で書くと、、、
docker build -t img2excel-server . && docker run -p 80:80 -it --rm --name my-img2excel-server img2excel-server
```

## デプロイ設定

| キー | バリュー |
| ---- | ---- |
| Name | img2excel-server |
| Region | Oregon(US West) |
| Branch | main |
| Root Directory |  |
| Environment | Docker |
| Dockerfile Path | ./src/Dockerfile |
| Docker Build Context Directory |  |
| Docker Command |  |
