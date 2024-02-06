import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Quill from 'quill';

export default function EditPost() {
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/posts/${id}`, {
          credentials: 'include',
        });

        if (response.ok) {
          const post = await response.json();
          setTitle(post.title);
          setSummary(post.summary);
          setContent(post.content);
          setImage(post.image);
        } else {
          console.error('Failed to fetch post');
        }
      } catch (error) {
        console.error('Error fetching post', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEdit = () => {
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('content', content);
    formData.append('image', image);

    fetch(`http://localhost:3001/api/posts/${id}`, {
      method: 'PUT',
      body: formData,
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        if (data.message === 'Post edited successfully') {
          toast.success('Post edited successfully');
          window.location.href = `/`;
        } else {
          toast.error('Failed to edit the post');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const Delta = Quill.import('delta');

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['bold', 'italic', 'underline'],
      ['link'],
      [{ align: [] }],
      ['clean'],
    ],
  };

  const quillRef = React.createRef();

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
        const ops = delta.ops.map((op) => ({ insert: op.insert }));
        return new Delta(ops);
      });
    }
  }, [quillRef]);

  const handlePaste = (e) => {
    const quill = quillRef.current.getEditor();
    const clipboardData = e.clipboardData || window.clipboardData;
  
    // Check if the clipboard data includes HTML
    if (clipboardData.types.includes('text/html')) {
      const pastedHTML = clipboardData.getData('text/html');
  
      // Insert pasted HTML into the editor
      quill.clipboard.dangerouslyPasteHTML(pastedHTML);
    } else {
      // If plain text, insert with the specified color
      const plainText = clipboardData.getData('text/plain');
      const delta = new Delta().insert(plainText, { color: '#222' });
      quill.updateContents(delta);
    }
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '878px', height: '40px' }}
      />

      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        style={{ width: '878px', height: '40px' }}
      />

      <input type="file" onChange={handleImageChange} />

      {image && (
        <div>
          <img src={image} alt="Post" style={{ maxWidth: '100%', maxHeight: '300px' }} />
        </div>
      )}

      <ReactQuill
        ref={quillRef}
        value={content}
        onChange={setContent}
        modules={modules}
        onPaste={handlePaste}
      />

      <button onClick={handleEdit}>Save</button>
    </div>
  );
}
