const Camp = ({ data }) => {
  return (
    <div>
      {data ? (
        <div key={data.data._id}>
          <h2>{data.data.name}</h2>
          <p>{data.data.desc}</p>
          <img src={data.data.image} />
        </div>
      ) : (
        <h2>loading...</h2>
      )}
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const { id } = ctx.query;
  const res = await fetch(`http://localhost:3000/api/camp/${id}`);
  const data = await res.json();
  return { props: { data } };
}

export default Camp;
