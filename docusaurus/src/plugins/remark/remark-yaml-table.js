import { visit } from 'unist-util-visit';
import yaml from 'js-yaml';

module.exports = function remarkYamlTable() {
    return (tree) => {
        visit(tree, 'code', (node, index, parent) => {
            if (node.lang === 'yaml-table') {
                try {
                    const data = yaml.load(node.value);
                    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
                        const headers = Object.keys(data[0]);

                        // Construct Markdown table as AST nodes
                        const tableRows = data.map((row) => ({
                            type: 'tableRow',
                            children: headers.map((header) => ({
                                type: 'tableCell',
                                children: [{ type: 'text', value: String(row[header] ?? '') }],
                            })),
                        }));

                        const tableNode = {
                            type: 'table',
                            align: headers.map(() => null),
                            children: [
                                {
                                    type: 'tableRow',
                                    children: headers.map((header) => ({
                                        type: 'tableCell',
                                        children: [{ type: 'text', value: header }],
                                    })),
                                },
                                ...tableRows,
                            ],
                        };

                        // Replace the YAML code block with the generated table
                        parent.children[index] = tableNode;
                    }
                } catch (error) {
                    console.error('YAML parsing error:', error);
                }
            }
        });
    };
};
