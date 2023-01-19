import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export const downloadDataAsJson = (data, fileName) => {
  const dataStr =
    'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, '\t'));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', fileName + '.json');
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

/**
 *
 * @param {*} jsons : list of {data:{}, fileName:String}
 * @param {*} fileName : string, final name of zip
 */
export const createZipAndDowload = async (jsons = [], fileName) => {
  var zip = new JSZip();
  await jsons.map(
    async ({ data, fileName }) =>
      await zip.file(`${fileName}.json`, JSON.stringify(data, null, '\t'))
  );

  zip.generateAsync({ type: 'blob' }).then(
    function (blob) {
      saveAs(blob, `${fileName}.zip`); // 2) trigger the download
    },
    function (err) {
      console.error(err);
    }
  );
};
