import styles from './index.module.css'
import React, { useCallback, useState, useEffect } from 'react';
import { Assembler } from "obj-assembler"

const assembler = new Assembler();

const App = () => {
  const [source, setSource] = useState("{}");
  const [mainData, setMainData] = useState("{}");
  const [processing, setProcessing] = useState(false);
  
  useEffect(() => {
    fetch("data/sample-data.json").then(async result => {
      setSource(JSON.stringify(await result.json(), null, "  "));
    });
  }, []);

  const processData = useCallback(async () => {
    setProcessing(true);
    setMainData(JSON.stringify(await assembler.assemble(
      JSON.parse(source),
      "data/",
    ),null, "  "));
    setProcessing(false);
  }, [source]);

  return <>
    <div className={styles["container"]}>
      <textarea id="data" placeholder="mainData" value={source} onChange={e => setSource(e.target.value)} />
      <textarea id="result-data" placeholder="mainData" value={mainData} readOnly />
    </div>
    <p>
      <button disabled={processing} type="button" onClick={processData}>Process</button>
    </p>
  </>;
}

export default App
