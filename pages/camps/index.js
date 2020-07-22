import { Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const Camps = ({ data }) => {
  // const handelDelete = async (id) => {
  //   try {
  //     const res = await fetch(`http://localhost:3000/api/camp/${id}`, {
  //       method: 'DELETE',
  //     });
  //     router.reload();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div>
      <Typography variant='h2' color='initial'>
        Camps
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Text</TableCell>
              <TableCell align='right'>Posted By</TableCell>
              <TableCell align='right'>Avatar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data ? (
              data.map((camp) => (
                <TableRow key={camp._id}>
                  <TableCell component='th' scope='row'>
                    {camp.text}
                  </TableCell>
                  <TableCell align='right'>{camp.postedBy.name}</TableCell>
                  <TableCell align='right'>
                    <Avatar alt='...' src={camp.image} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <h2>loading...</h2>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Link href='/camps/add'>
        <a>Add Camp</a>
      </Link>
      <Link href={{ pathname: '/camps/add', query: { id: camp._id } }}>
              <a>Update Camp</a>
            </Link>
            <button onClick={() => handelDelete(camp._id)}>Delete</button> */}
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const res = await fetch('http://localhost:3000/api/posts');
  const data = await res.json();
  return { props: { data } };
}

export default Camps;
