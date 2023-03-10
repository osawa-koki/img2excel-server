import Layout from '../components/Layout';
import Setting from '../setting';

const IndexPage = () => (
  <Layout>
    <div>
      <div id='Index'>
        <div id='MainTopic'>
          <h1>Hello {Setting.title} π</h1>
          <p>η»εγγ‘γ€γ«γExcelγγ‘γ€γ«γ«ε€ζγγγιγ³γγΌγ«γ§γγ</p>
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
