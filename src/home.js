import { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress } from "@material-ui/core";
import image from "./lungs.avif"; // Your background image file. Ensure this is in the 'src' folder.
import { DropzoneArea } from 'material-ui-dropzone';
import { common } from '@material-ui/core/colors';
import Clear from '@material-ui/icons/Clear';


// Styled Material-UI Button for a consistent and professional look
const ColorButton = withStyles((theme) => ({
  root: {
    color: '#E0E0E0', // Light text for dark mode button
    backgroundColor: '#37474F', // Darker background for the button
    '&:hover': {
      backgroundColor: '#455A64', // Slightly lighter on hover
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)', // More prominent shadow
    },
    transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  },
}))(Button);

const axios = require("axios").default;

// Material-UI styles using makeStyles hook for Dark Mode
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  clearButton: {
    width: "fit-content",
    minWidth: "180px",
    borderRadius: "25px",
    padding: "12px 30px",
    fontSize: "1.15rem",
    fontWeight: 700,
    textTransform: 'none',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.25)', // Stronger shadow for dark mode
  },
  media: {
    width: '100%', // Ensure it takes full width of its container
    maxHeight: 400, // Set a maximum height to prevent overly large images
    objectFit: 'contain', // Ensures the whole image is visible within its boundaries
    backgroundRepeat: 'no-repeat', // This property is less relevant now with object-fit, but doesn't hurt
    backgroundPosition: 'center', // Centers the image
    borderRadius: '10px',
    flexShrink: 0, // Prevent it from shrinking too much
    padding: theme.spacing(1), // Add slight padding to the image itself
  },
  gridContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: "2em 1em",
    minHeight: 'calc(100vh - 64px - 4em)',
    flexGrow: 1,
  },
  mainContainer: {
    backgroundColor: '#1A2027', // Set a solid background color matching the AppBar
    height: "calc(100vh - 64px)",
    marginTop: "0px",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    overflow: 'hidden',
    // The background image and its overlay are now removed.
  },
  contentWrapper: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingTop: theme.spacing(4),
  },
  imageCard: {
    margin: "auto",
    maxWidth: 480,
    minHeight: 520, // Increased minHeight to accommodate content better
    backgroundColor: 'rgba(40, 50, 60, 0.85)', // Darker, translucent background for card
    boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.6)', // More prominent shadow for dark mode
    borderRadius: '25px',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.15)', // Subtle lighter border
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.7)', // Enhanced shadow on hover
    },
  },
  imageCardEmpty: {
    minHeight: '300px',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    backgroundColor: '#263238', // Darker background when empty
  },
  tableContainer: {
    backgroundColor: 'transparent !important',
    boxShadow: 'none !important',
    padding: '10px 0',
  },
  table: {
    backgroundColor: 'transparent !important',
  },
  tableHead: {
    backgroundColor: 'transparent !important',
  },
  tableRow: {
    backgroundColor: 'transparent !important',
  },
  tableCell: {
    fontSize: '26px',
    backgroundColor: 'transparent !important',
    borderColor: 'transparent !important',
    fontWeight: 'bolder',
    padding: '6px 24px 6px 16px',
    textAlign: 'center',
    color: '#E0E0E0', // Light text for results
  },
  tableCell1: {
    fontSize: '18px',
    backgroundColor: 'transparent !important',
    borderColor: 'transparent !important',
    color: '#A0A0A0 !important', // Lighter grey for labels
    fontWeight: 'normal',
    padding: '6px 24px 6px 16px',
    textAlign: 'center',
  },
  tableBody: {
    backgroundColor: 'transparent !important',
  },
  detail: {
    backgroundColor: '#263238', // Dark background for the detail section
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
    borderBottomLeftRadius: '25px',
    borderBottomRightRadius: '25px',
    flexGrow: 1,
  },
  appbar: {
    background: '#1A2027', // Very dark blue-grey for the AppBar
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)', // Stronger shadow
    color: '#E0E0E0', // Light text for AppBar
    zIndex: theme.zIndex.drawer + 1,
  },
  appBarTitle: {
    flexGrow: 1,
    textAlign: 'center',
    fontSize: '5rem',
    fontWeight: 700,
    textShadow: '1px 1px 3px rgba(0,0,0,0.6)', // Stronger shadow
    letterSpacing: '0.03em',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.5rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.2rem',
    },
  },
  loader: {
    color: '#64B5F6 !important', // Light blue loader for dark theme
    marginBottom: theme.spacing(3),
    animation: '$spin 1s linear infinite',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  dropzoneText: {
    color: '#E0E0E0', // Light text for main instruction in dark mode
    fontSize: '1.4rem',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: '1.5',
    margin: '0 20px',
  },
  dropzoneHintText: {
    color: '#A0A0A0', // Lighter grey for hint text in dark mode
    fontSize: '0.9rem',
    marginTop: theme.spacing(1.5),
    textAlign: 'center',
    fontWeight: 'normal',
  },
  // Styles for Result Text (Normal/Pneumonia) - Adjusted for Dark Mode
  normalText: {
    color: '#69F0AE !important', // Vibrant green for "Normal"
    fontSize: '36px !important',
    fontWeight: 'bolder !important',
    textShadow: '1px 1px 2px rgba(0, 200, 0, 0.4)', // Subtle shadow
  },
  pneumoniaText: {
    color: '#FF5252 !important', // Vibrant red for "Pneumonia"
    fontSize: '36px !important',
    fontWeight: 'bolder !important',
    textShadow: '1px 1px 2px rgba(200, 0, 0, 0.4)', // Subtle shadow
  },
  cardActionArea: {
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.01)',
    },
  },
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [imageSelected, setImageSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let confidence = 0;

  const [resultTextColorClass, setResultTextColorClass] = useState('');

  const sendFile = async () => {
    if (imageSelected) {
      setIsLoading(true);
      let formData = new FormData();
      formData.append("file", selectedFile);

      try {
        let res = await axios({
          method: "post",
          url: process.env.REACT_APP_API_URL,
          data: formData,
        });

        if (res.status === 200) {
          setData(res.data);
          if (res.data.class && res.data.class.toLowerCase() === 'normal') {
            setResultTextColorClass(classes.normalText);
          } else if (res.data.class && res.data.class.toLowerCase() === 'pneumonia') {
            setResultTextColorClass(classes.pneumoniaText);
          } else {
            setResultTextColorClass('');
          }
        } else {
          console.error("API returned non-200 status:", res.status, res.data);
          alert("Analysis failed. Server returned an unexpected response.");
        }
      } catch (error) {
        console.error("API call failed:", error);
        alert("Failed to connect to the AI analysis service. Please check your connection or try again later.");
      } finally {
        setIsLoading(false);
      }
    }
  }

  const clearData = () => {
    setData(null);
    setImageSelected(false);
    setSelectedFile(null);
    setPreview(null);
    setResultTextColorClass('');
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (preview && selectedFile) {
      sendFile();
    }
  }, [preview, selectedFile]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImageSelected(false);
      setData(undefined);
      setResultTextColorClass('');
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImageSelected(true);
    setResultTextColorClass('');
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <React.Fragment>
      {/* Top AppBar with centered title */}
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <div className={classes.grow} />
          <Typography variant="h6" className={classes.appBarTitle}>
            AI Lung Disease Classification
          </Typography>
          <div className={classes.grow} />
        </Toolbar>
      </AppBar>

      {/* Main content container with solid background color matching the AppBar */}
      <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
        {/* Wrapper to ensure content sits above the background */}
        <div className={classes.contentWrapper}>
          <Grid
            className={classes.gridContainer}
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={12}>
              {/* Main Card for image upload/display and results */}
              <Card className={`${classes.imageCard} ${!imageSelected ? classes.imageCardEmpty : ''}`}>
                {imageSelected && (
                  <CardActionArea className={classes.cardActionArea}>
                    <CardMedia
                      className={classes.media}
                      image={preview}
                      component="img" // This is important for objectFit to work
                      title="Uploaded CXR Image"
                    />
                  </CardActionArea>
                )}
                {!imageSelected && (
                  <CardContent className={classes.content}>
                    <DropzoneArea
                      acceptedFiles={['image/jpeg', 'image/png', 'image/gif']}
                      dropzoneText={
                        <>
                          <span className={classes.dropzoneText}>Drag and drop a chest X-ray image (CXR) for analysis</span>
                          <Typography variant="caption" className={classes.dropzoneHintText}>
                            (Accepted formats: JPG, PNG, GIF)
                          </Typography>
                        </>
                      }
                      onChange={onSelectFile}
                      filesLimit={1}
                      showPreviewsInDropzone={false}
                      showFileNamesInDropzone={false}
                      showFileNames={false}
                    />
                  </CardContent>
                )}
                {data && (
                  <CardContent className={classes.detail}>
                    <TableContainer component={Paper} className={classes.tableContainer}>
                      <Table className={classes.table} size="small" aria-label="simple table">
                        <TableHead className={classes.tableHead}>
                          <TableRow className={classes.tableRow}>
                            <TableCell className={classes.tableCell1}>Label:</TableCell>
                            <TableCell align="right" className={classes.tableCell1}>Confidence:</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody className={classes.tableBody}>
                          <TableRow className={classes.tableRow}>
                            <TableCell component="th" scope="row" className={`${classes.tableCell} ${resultTextColorClass}`}>
                              {data.class}
                            </TableCell>
                            <TableCell align="right" className={classes.tableCell}>{confidence}%</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                )}
                {isLoading && (
                  <CardContent className={classes.detail}>
                    <CircularProgress color="secondary" className={classes.loader} />
                    <Typography variant="h6" className={classes.dropzoneText} noWrap>
                      Processing...
                    </Typography>
                  </CardContent>
                )}
              </Card>
            </Grid>
            {data && (
              <Grid item className={classes.buttonGrid}>
                <ColorButton
                  variant="contained"
                  className={classes.clearButton}
                  color="primary"
                  component="span"
                  size="large"
                  onClick={clearData}
                  startIcon={<Clear fontSize="large" />}
                >
                  Clear
                </ColorButton>
              </Grid>
            )}
          </Grid>
        </div>
      </Container>
    </React.Fragment>
  );
};