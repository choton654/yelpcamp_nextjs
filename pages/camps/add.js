import router from 'next/router';
import { useEffect, useState } from 'react';

const AddCamp = ({ data, allCamps: { data: campsData } }) => {
  const [camp, setcamp] = useState({
    name: '',
    desc: '',
    image: '',
  });

  const [isSubmit, setIsSubmit] = useState(false);
  const [error, setError] = useState('');

  let id;

  if (data) {
    id = data.data._id;
  }

  useEffect(() => {
    if (!error && isSubmit && id) {
      updateCamp();
      return;
    }
    if (!error && isSubmit) {
      console.log(error);
      createCamp();
    }
  }, [isSubmit, error, id]);

  const createCamp = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/camp', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(camp),
      });
      const data = await res.json();
      console.log(res);

      if (res.status === 500) {
        setError('camp already exists');
        return;
      }
      if (!error) {
        router.push('/camps');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateCamp = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/camp/${id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(camp),
      });
      const data = await res.json();
      console.log(res);

      if (res.status === 500) {
        setError(data.msg);
        return;
      }
      if (!error) {
        router.push('/camps');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    // campsData.find((c) => {
    //   if (c._id === id) {
    //     setsingleCamp(c);
    //   }
    // });
    setIsSubmit(true);
    console.log(isSubmit);
    console.log(camp);
  };

  const handelChange = (e) => {
    setcamp({ ...camp, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {error && <h3>{error}</h3>}
      {data ? (
        <form onSubmit={handelSubmit}>
          <label htmlFor='name'>CampName</label>
          <input
            id='name'
            type='text'
            value={data.data.name}
            name='name'
            placeholder='Camp name'
            onChange={handelChange}
            required
            disabled
          />
          <label htmlFor='desc'>Description</label>
          <input
            id='desc'
            type='text'
            value={data.data.desc}
            name='desc'
            placeholder='Camp Description'
            onChange={handelChange}
          />
          <label htmlFor='image'>Image Url</label>
          <input
            id='image'
            type='text'
            value={data.data.image}
            name='image'
            placeholder='Image Url'
            onChange={handelChange}
            required
          />
          {/* <input type='submit' value={data ? 'update camp' : 'add camp'} /> */}
          <input type='submit' value='update' />
        </form>
      ) : (
        <form onSubmit={handelSubmit}>
          <label htmlFor='name'>CampName</label>
          <input
            id='name'
            type='text'
            value={camp.name}
            name='name'
            placeholder='Camp name'
            onChange={handelChange}
            required
          />
          <label htmlFor='desc'>Description</label>
          <input
            id='desc'
            type='text'
            value={camp.desc}
            name='desc'
            placeholder='Camp Description'
            onChange={handelChange}
          />
          <label htmlFor='image'>Image Url</label>
          <input
            id='image'
            type='text'
            value={camp.image}
            name='image'
            placeholder='Image Url'
            onChange={handelChange}
            required
          />
          {/* <input type='submit' value={data ? 'update camp' : 'add camp'} /> */}
          <input type='submit' value='add' />
        </form>
      )}
      {/* <form onSubmit={handelSubmit}>
        <label htmlFor='name'>CampName</label>
        <input
          id='name'
          type='text'
          value={camp.name}
          name='name'
          placeholder='Camp name'
          onChange={handelChange}
          required
        />
        <label htmlFor='desc'>Description</label>
        <input
          id='desc'
          type='text'
          value={camp.desc}
          name='desc'
          placeholder='Camp Description'
          onChange={handelChange}
        />
        <label htmlFor='image'>Image Url</label>
        <input
          id='image'
          type='text'
          value={camp.image}
          name='image'
          placeholder='Image Url'
          onChange={handelChange}
          required
        />
        <input type='submit' value={data ? 'update camp' : 'add camp'} />
      </form> */}
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const { id } = ctx.query;
  let data = null;
  if (id) {
    const res = await fetch(`http://localhost:3000/api/camp/${id}`);
    data = await res.json();
  }

  const res = await fetch('http://localhost:3000/api/camp');
  const allCamps = await res.json();

  return { props: { data, allCamps } };
}

export default AddCamp;
