export default function TableOverflow(props) {
  const { headers, data, min_width } = props;

  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <table style={{ minWidth: min_width, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {headers.map((h, hidx) => {
              return <th key={"h_" + hidx}>{h}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ridx) => {
            return (
              <tr key={"r_" + ridx}>
                {row.map((column, cidx) => {
                  return <td key={"r" + ridx + "_c" + cidx}>{column}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
