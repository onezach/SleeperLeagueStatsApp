export default function NoMatch() {
  return (
    <div>
      <h2 style={{ margin: "0.5rem" }}>You're not supposed to be here.</h2>
      <iframe
        style={{ margin: "0.5rem" }}
        width="853"
        height="480"
        src={`https://www.youtube.com/embed/hZ7loWxYYrs`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </div>
  );
}