import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import 'react-quill/dist/quill.core.css'; // Import Quill core styles
import Button from '@material-ui/core/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Delta from 'quill-delta'; // Import Quill Delta
import { Select } from '@mui/material';
import {MenuItem} from '@mui/material';
import {FormControl} from '@mui/material';
import {InputLabel} from '@mui/material';
const modules = {
  toolbar: [
    [{ size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
      { align: [] },
    ],
    [
      {
        color: [
          '#000000',
          '#e60000',
          '#ff9900',
          '#ffff00',
          '#008a00',
          '#0066cc',
          '#9933ff',
          '#ffffff',
          '#facccc',
          '#ffebcc',
          '#ffffcc',
          '#cce8cc',
          '#cce0f5',
          '#ebd6ff',
          '#bbbbbb',
          '#f06666',
          '#ffc266',
          '#ffff66',
          '#66b966',
          '#66a3e0',
          '#c285ff',
          '#888888',
          '#a10000',
          '#b26b00',
          '#b2b200',
          '#006100',
          '#0047b2',
          '#6b24b2',
          '#444444',
          '#5c0000',
          '#663d00',
          '#666600',
          '#003700',
          '#002966',
          '#3d1466',
          'custom-color',
        ],
      },
    ],
  ],
};

const formats = [
  'header',
  'height',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'color',
  'bullet',
  'indent',
  'link',
  'image',
  'align',
  'size',
];

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(); // Default category


  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSummaryChange = (event) => {
    setSummary(event.target.value);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value)
  };

  const handlePublish = () => {
    // Validation
    if (!title || !summary || !content || !image || !category) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('content', content);
    formData.append('image', image);
    formData.append('category', category);

    fetch('http://localhost:3001/api/post', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Post successfully saved:', data);

        setLoading(false);

        if (data.message === 'Blog post saved successfully') {
          toast.success('Post published successfully');
          window.location.href = '/';
        } else {
          toast.error('Failed to publish the post');
        }
      })
      .catch((error) => {
        console.error('Error saving post:', error);

        setLoading(false);
      });
  };

  const quillRef = React.createRef();

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();

      quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
        if (node.tagName === 'A') {
          // Handle anchor elements (links)
          const anchorDelta = new Delta();
          anchorDelta.insert(node.textContent, { link: node.getAttribute('href') });
          return anchorDelta;
        }
        // Handle other elements as before
        const ops = delta.ops.map((op) => ({ insert: op.insert }));
        return new Delta(ops);
      });
    }
  }, [quillRef]);

  return (
    <div>
      <form>
        <input
          type="text"
          placeholder="Title"
          style={{ width: '878px', height: '40px' }}
          value={title}
          onChange={handleTitleChange}
        />
        <br />
        <input
          type="text"
          placeholder="Summary"
          style={{ width: '878px', height: '40px' }}
          value={summary}
          onChange={handleSummaryChange}
        />
        <br></br>

        <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Category</InputLabel>
  <Select
   
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={category}
    label="Category"
    onChange={handleCategoryChange}
  >
    <MenuItem value="Technology" style={{maxWidth:"100%",display:"block"}}>Technology</MenuItem>
    <MenuItem value="General"style={{maxWidth:"100%",display:"block"}}>General</MenuItem>
    <MenuItem value="Gaming"style={{maxWidth:"100%",display:"block"}}>Gaming</MenuItem>
    <MenuItem value="Sports"style={{maxWidth:"100%",display:"block"}}>Sports</MenuItem>
    <MenuItem value="Business"style={{maxWidth:"100%",display:"block"}}>Business</MenuItem>
    <MenuItem value="Food"style={{maxWidth:"100%",display:"block"}}>Food</MenuItem>
    <MenuItem value="Political"style={{maxWidth:"100%",display:"block"}}>Political</MenuItem>
  </Select>
</FormControl>
        <input type="file" onChange={handleImageChange} style={{ width: '878px', height: '40px',marginTop: '10px' }}/>
        
      </form>
      <ReactQuill
        ref={quillRef}
        modules={modules}
        formats={formats}
        value={content}
        onChange={handleContentChange}
      />
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '16px' }}
        onClick={handlePublish}
        disabled={loading} // Disable button when loading
      >
        {loading ? 'Publishing...' : 'Publish'}
      </Button>
    </div>
  );
}
