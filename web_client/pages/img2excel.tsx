import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Jimp from 'jimp/browser/lib/jimp';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

import Layout from '../components/Layout';

const Img2ExcelPage = () => {

  let [jimp, setJimp] = useState<Jimp | null>(null);
  let [loading, setLoading] = useState(false);

  return (
    <Layout>
      <div>
        <div id='Img2Excel'>
          <Form.Group>
            <Form.Label>Send image file to convert to "Excel".</Form.Label>
            <Form.Control type="file" disabled={loading} />
          </Form.Group>
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
        </div>
      </div>
    </Layout>
  );
};

export default Img2ExcelPage;
