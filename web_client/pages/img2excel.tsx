import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Jimp from 'jimp/browser/lib/jimp';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';

import File2Jimp from '../common/File2Jimp';
import Layout from '../components/Layout';

const Img2ExcelPage = () => {

  let canvasRef: HTMLCanvasElement | null = null;

  let [jimp, setJimp] = useState<Jimp | null>(null);
  let [error, setError] = useState<string | null>(null);
  let [loading, setLoading] = useState(false);

  function Draw(jimp: Jimp): void {
    const canvas = this.CanvasRef.current;
    if (canvas === null) return;
    const ctx = canvas.getContext('2d');
    if (ctx === null) return;
    const width = jimp.bitmap.width;
    const height = jimp.bitmap.height;
    canvas.width = width;
    canvas.height = height;
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(jimp.bitmap.data);
    ctx.putImageData(imageData, 0, 0);
  };

  async function Import(files: FileList): Promise<void> {
    if (files.length === 0) {
      console.log(files);
      return;
    }
    const file = files[0];
    console.log(file)
    await File2Jimp(file)
    .then((jimp: Jimp): void => {
      setJimp(jimp);
      Draw(jimp);
    })
    .catch((err: Error): void => {
      console.log(err);
      window.alert("画像ファイルのMIME対応が不正です。\nPNG・GIF・JPEG・WEBPのいずれかのファイルを指定して下さい。");
    });
  };

  useEffect(() => {
    canvasRef = document.getElementById('MyCanvas') as HTMLCanvasElement;
    const canvas = canvasRef;
    if (canvas === null) {
      setError('Service unavailable... (canvas is null.)');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
      setError('Service unavailable... (ctx is null.)');
      return;
    }
    const width = 400;
    const height = 300;
    const step = 20;
    const hue_random = Math.floor(Math.random() * 360);
    for (let x = 0; x < width; x += step) {
      for (let y = 0; y < height; y += step) {
        ctx.fillStyle = `hsl(${hue_random}, ${Math.random() * (90 - 10) + 10}%, 80%)`;
        ctx.fillRect(x, y, step, step);
      }
    }
  }, []);

  return (
    <Layout>
      <div>
        <div id='Img2Excel'>
          <Form.Group>
            <Form.Label>Send image file to convert to "Excel".</Form.Label>
            <Form.Control type="file" onInput={(e) => {Import((e.target as HTMLInputElement).files)}} disabled={loading} />
          </Form.Group>
          {
            error &&
            <div id="Error">
              <Alert severity="error">{error}</Alert>
            </div>
          }
          {
            loading &&
            <div id='Loading'>
              <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
                <LinearProgress color="secondary" />
                <LinearProgress color="success" />
                <LinearProgress color="inherit" />
              </Stack>
            </div>
          }
          {
            //jimp &&
            <div id='JimpImage'>
              <canvas id='MyCanvas'></canvas>
            </div>
          }
        </div>
      </div>
    </Layout>
  );
};

export default Img2ExcelPage;
