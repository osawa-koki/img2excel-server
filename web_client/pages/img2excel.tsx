import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

import Layout from '../components/Layout';
import Setting from '../setting';

const Img2ExcelPage = () => {

  let [imported, setImported] = useState<boolean>(false);
  let [excelblob, setExcelBlob] = useState<Blob | null>(null);
  let [filename, setFilename] = useState<string>('img2excel');
  let [error, setError] = useState<string | null>(null);
  let [loading, setLoading] = useState(false);
  let [sending, setSending] = useState(false);

  const File2Canvas = async (file: File) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function() {
      const data = reader.result;
      const canvas = document.getElementById('MyCanvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      const image = new Image();
      image.src = data as string;
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        setImported(true);
      }
    }
  };

  async function Import(files: FileList): Promise<void> {
    setLoading(true);
    setError(null);
    if (files.length === 0) {
      return;
    }
    const file = files[0];
    const rawname = file.name;
    const splitted_name = rawname.split('.');
    if (splitted_name.length === 1) {
      setError("画像ファイルの拡張子が不正です。\nPNG・GIF・JPEG・WEBPのいずれかのファイルを指定して下さい。");
      DrawInit();
      setLoading(false);
      return;
    }
    splitted_name.pop();
    setFilename(splitted_name.join('.'));
    await File2Canvas(file);
    setLoading(false);
  };

  function DrawInit(): void {
    const canvas = document.getElementById('MyCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const width = 400;
    const height = 300;
    canvas.width = width;
    canvas.height = height;
    const step = 20;
    const hue_random = Math.floor(Math.random() * 360);
    for (let x = 0; x < width; x += step) {
      for (let y = 0; y < height; y += step) {
        ctx.fillStyle = `hsl(${hue_random}, ${Math.random() * (90 - 10) + 10}%, 80%)`;
        ctx.fillRect(x, y, step, step);
      }
    }
  }

  async function Send() {
    setSending(true);
    let blob;
    (document.getElementById("MyCanvas") as HTMLCanvasElement).toBlob(async (blob) => {
      await fetch(`${Setting.apiUri}/img2excel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'image/png',
        },
        body: blob,
      })
      .then(response => response.blob())
      .then(response => {
        console.log(`byte -> ${blob.size}`);
        setExcelBlob(response);
      });
      setSending(false);
    });
  }

  useEffect(() => {
    const canvas = document.getElementById('MyCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (canvas === null) {
      setError('Service unavailable... (canvas is null.)');
      return;
    }
    if (ctx === null) {
      setError('Service unavailable... (ctx is null.)');
      return;
    }
    DrawInit();
  }, []);

  return (
    <Layout>
      <div>
        <div id='Img2Excel'>
          <Form.Group>
            <Form.Label>Send image file to convert to "Excel".</Form.Label>
            <Form.Control type="file" onInput={(e) => {Import((e.target as HTMLInputElement).files as FileList)}} disabled={loading} />
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
            <div id='JimpImage'>
              <canvas id='MyCanvas'></canvas>
            </div>
          }
          {
            imported &&
            <div id='Converter'>
              <Button variant="contained" onClick={() => {Send();}}>Convert</Button>
            </div>
          }
          {
            sending &&
            <div id='Sending'>
              <Stack id='SendingLoader' sx={{ color: 'grey.500' }} spacing={2} direction="row">
                <CircularProgress color="secondary" />
                <CircularProgress color="success" />
                <CircularProgress color="inherit" />
              </Stack>
            </div>
          }
          {
            excelblob &&
            <div id='ExcelBlob'>
              <Alert className='Info' severity="success">Convertion to 'Excel' successed!<br />Download by clicking button below.</Alert>
              <TextField variant="outlined" value={filename} onInput={(e) => {(e.target as HTMLInputElement).value}} />
              <Button href={window.URL.createObjectURL(new Blob([excelblob], {type: "application/Zip"}))} download={`${filename}.xlsx`} variant="outlined" >
                Download
              </Button>
            </div>
          }
        </div>
      </div>
    </Layout>
  );
};

export default Img2ExcelPage;
