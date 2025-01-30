import { visit } from 'unist-util-visit';

module.exports = function remarkCodeSections() {
    const desc_text = "description:";
    const command_text = "command:";
    const code_text = "code:";
    const results_text = "results:";
    return (tree) => {
        visit(tree, 'code', (node, index, parent) => {
            if (node.lang && node.lang.startsWith('example-')) {
                const lang = node.lang.replace('example-', '').trim(); // Extract language (e.g., "bash", "go")
                const lines = node.value.split('\n');
                let description = '', command = '', code = '', results = '';
                let currentSection = '';

                lines.forEach((line) => {
                    if (line.startsWith(desc_text)) {
                        currentSection = 'description';
                        description = line.replace(desc_text, '').trim();
                    } else if (line.startsWith(command_text)) {
                        currentSection = 'command';
                        command = line.replace(command_text, '').trim();
                    } else if (line.startsWith(code_text)) {
                        currentSection = 'code';
                        code = line.replace(code_text, '').trim();
                    } else if (line.startsWith(results_text)) {
                        currentSection = 'results';
                        results = line.replace(results_text, '').trim();
                    } else {
                        if (currentSection === 'description') description += `\n${line}`;
                        else if (currentSection === 'command') command += `\n${line}`;
                        else if (currentSection === 'code') code += `\n${line}`;
                        else if (currentSection === 'results') results += `\n${line}`;
                    }
                });

                const divWrapper = {
                    type: 'div',
                    data: {
                        hName: 'div',
                        hProperties: { className: 'code-section' }
                    },
                    children: [],
                };

                if (description) {
                    const descDiv = {
                        type: 'div',
                        data: {
                            hName: 'div',
                            hProperties: { className: 'code-section-desc' }
                        },
                        children: [],
                    };
                    descDiv.children.push(
                        { type: 'paragraph', children: [{ type: 'strong', children: [{ type: 'text', value: 'Description:' }] }] },
                        { type: 'paragraph', children: [{ type: 'text', value: description.trim() }], data: { hProperties: { style: "padding-bottom: 10px;" } } },
                    );
                    divWrapper.children.push(descDiv);
                }

                if (command) {
                    const cmdDiv = {
                        type: 'div',
                        data: {
                            hName: 'div',
                            hProperties: { className: 'code-section-command' }
                        },
                        children: [],
                    };
                    cmdDiv.children.push(
                        { type: 'paragraph', children: [{ type: 'strong', children: [{ type: 'text', value: 'Command:' }] }] },
                        { type: 'code', lang: 'sh', value: command.trim() } // Treat command as shell script
                    );
                    divWrapper.children.push(cmdDiv);
                }

                if (code) {
                    const codeDiv = {
                        type: 'div',
                        data: {
                            hName: 'div',
                            hProperties: { className: 'code-section-code' }
                        },
                        children: [],
                    };
                    codeDiv.children.push(
                        { type: 'paragraph', children: [{ type: 'strong', children: [{ type: 'text', value: 'Code:' }] }] },
                        { type: 'code', lang: lang, value: code.trim() } // Uses detected language
                    );
                    divWrapper.children.push(codeDiv);
                }

                if (results) {
                    const resultsDiv = {
                        type: 'div',
                        data: {
                            hName: 'div',
                            hProperties: { className: 'code-section-results' }
                        },
                        children: [],
                    };
                    resultsDiv.children.push(
                        { type: 'paragraph', children: [{ type: 'strong', children: [{ type: 'text', value: 'Results:' }] }] },
                        {
                            type: 'code',
                            lang: 'buttonless', // Apply the buttonless class so docusaurus doesn't provide the 'copy' button
                            value: results.trim()
                        }
                    );
                    divWrapper.children.push(resultsDiv);
                }

                parent.children.splice(index, 1, divWrapper);
            }
        });
    };
};
