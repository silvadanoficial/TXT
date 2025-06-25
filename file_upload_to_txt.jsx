import React, { useState } from 'react';

export default function FileUploadToTxt() {
  const [filesData, setFilesData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFilesData = [];
    let hasError = false;

    files.forEach((file) => {
      if (!file.type.startsWith('text/')) {
        hasError = true;
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const previewContent = content.split('\n').slice(0, 50).join('\n');

        newFilesData.push({
          name: file.name,
          size: file.size,
          content,
          previewContent,
          downloadUrl: url,
          expanded: false,
        });

        if (newFilesData.length + (filesData.length || 0) === files.length && !hasError) {
          setFilesData((prevFiles) => [...prevFiles, ...newFilesData]);
        } else if (newFilesData.length + (filesData.length || 0) === files.length && hasError) {
          setFilesData((prevFiles) => [...prevFiles, ...newFilesData]);
          setErrorMessage('Alguns arquivos foram ignorados por não serem arquivos de texto.');
        }
      };

      try {
        reader.readAsText(file);
      } catch (error) {
        console.error(`Erro ao ler o arquivo ${file.name}:`, error);
      }
    });

    if (hasError && newFilesData.length === 0) {
      setErrorMessage('Nenhum arquivo de texto válido foi selecionado.');
    } else if (!hasError) {
      setErrorMessage('');
    }
  };

  const toggleExpand = (index) => {
    setFilesData((prevFiles) =>
      prevFiles.map((file, i) =>
        i === index ? { ...file, expanded: !file.expanded } : file
      )
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
      <h1 className="text-2xl font-bold">Upload e Gerar TXT</h1>

      <input
        type="file"
        accept="*/*"
        multiple
        onChange={handleFileUpload}
        className="p-2 border rounded"
      />

      {errorMessage && (
        <div className="text-red-500 font-medium mt-2">{errorMessage}</div>
      )}

      {filesData.length > 0 && (
        <div className="w-full max-w-xl flex flex-col gap-4 mt-4">
          {filesData.map((file, index) => (
            <div key={index} className="p-4 border rounded overflow-auto">
              <h2 className="text-lg font-semibold mb-2">
                {file.name} - {(file.size / 1024).toFixed(2)} KB
              </h2>
              <pre className="whitespace-pre-wrap break-words">
                {file.expanded ? file.content : file.previewContent}
              </pre>
              <button
                onClick={() => toggleExpand(index)}
                className="mt-2 mr-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                {file.expanded ? 'Ver Menos' : 'Ver Mais'}
              </button>
              <a
                href={file.downloadUrl}
                download={`arquivo_${file.name}.txt`}
                className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Baixar TXT Gerado
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
