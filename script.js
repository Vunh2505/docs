document.addEventListener('DOMContentLoaded', function () {
    const fileList = document.getElementById('file-list');
    const contentDiv = document.getElementById('markdown-content');

    // Sample structure for chapters and sections
    const markdownFiles = [
        {
            name: "Chapter 1",
            file: "docs/chapter1.md",
            children: []
        },
        {
            name: "Chapter 2",
            file: "docs/chapter2.md",
            children: [
                {
                    name: "Section 1 / Topic 1",
                    file: "docs/section1/topic1.md"
                },
                {
                    name: "Section 1 / Topic 2",
                    file: "docs/section1/topic2.md"
                }
            ]
        },
        {
            name: "Section 2 / Topic 3",
            file: "docs/section2/topic3.md",
            children: []
        }
    ];

    markdownFiles.forEach(doc => {
        const li = document.createElement('li');
        
        if (doc.children && doc.children.length > 0) {
            const button = document.createElement('button');
            button.className = 'collapsible';
            button.textContent = doc.name;
            li.appendChild(button);

            const ul = document.createElement('ul');
            ul.className = 'content';

            doc.children.forEach(child => {
                const subLi = document.createElement('li');
                const subA = document.createElement('a');
                subA.href = "#";
                subA.textContent = child.name;
                subA.dataset.file = child.file;
                subLi.appendChild(subA);
                ul.appendChild(subLi);

                subA.addEventListener('click', function (e) {
                    e.preventDefault();
                    loadMarkdown(this.dataset.file);
                });
            });

            li.appendChild(ul);
        } else {
            const a = document.createElement('a');
            a.href = "#";
            a.textContent = doc.name;
            a.dataset.file = doc.file;
            li.appendChild(a);

            a.addEventListener('click', function (e) {
                e.preventDefault();
                loadMarkdown(this.dataset.file);
            });
        }

        fileList.appendChild(li);
    });

    // Add event listener to collapsible buttons
    document.querySelectorAll('.collapsible').forEach(button => {
        button.addEventListener('click', function () {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });

    function loadMarkdown(file) {
        fetch(file)
            .then(response => response.text())
            .then(text => {
                contentDiv.innerHTML = marked.parse(text);
            })
            .catch(error => console.error('Error loading markdown file:', error));
    }

    // Load the first file by default
    if (markdownFiles.length > 0) {
        loadMarkdown(markdownFiles[0].file);
    }
});
