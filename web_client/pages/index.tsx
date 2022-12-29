import Link from 'next/link';
import Layout from '../components/Layout';
import Setting from '../setting';

const IndexPage = () => (
  <Layout>
    <div>
      <div id='Index'>
        <div id='MainTopic'>
          <h1>Hello {Setting.title} 👋</h1>
          <p>画像ファイルをExcelファイルに変換するお遊びツールです。</p>
          <div id='Fruits'>
            {
              ['tanuki', 'tako', 'suzume'].map((fruit, index) => (
                <img key={index} src={`${Setting.basePath}/${fruit}.gif`} alt="Img2Excel" />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default IndexPage;
