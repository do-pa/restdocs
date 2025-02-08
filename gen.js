// generate-docs.js
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

/**
 * 테스트 파일 코드에서 describe/it 블록과 함께 @responseField 어노테이션을 추출합니다.
 * @param {string} code - 테스트 파일의 소스 코드
 * @returns {Array} describe 블록 및 내부 테스트 케이스 정보를 포함한 배열
 */
function extractTestInfo(code) {
  // AST 파싱 옵션: comments 옵션을 명시적으로 true로 지정합니다.
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: [],
    comments: true,
  });

  const testInfo = [];
  const describeStack = [];

  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;
      // describe 블록인 경우
      if (callee.type === 'Identifier' && callee.name === 'describe') {
        const [descArg, funcArg] = path.node.arguments;
        if (descArg && descArg.type === 'StringLiteral' && funcArg) {
          const block = {
            description: descArg.value,
            tests: [],
            children: []
          };

          // 상위 describe가 있으면 자식에 추가, 아니면 최상위에 추가
          if (describeStack.length > 0) {
            const parent = describeStack[describeStack.length - 1];
            parent.children.push(block);
          } else {
            testInfo.push(block);
          }

          // 현재 describe 블록을 스택에 넣고 내부의 it 블록을 순회
          describeStack.push(block);
          path.get('arguments')[1].traverse({
            CallExpression(innerPath) {
              const innerCallee = innerPath.node.callee;
              // it 블록인 경우
              if (innerCallee.type === 'Identifier' && innerCallee.name === 'it') {
                const [itArg] = innerPath.node.arguments;
                if (itArg && itArg.type === 'StringLiteral') {
                  let responseFields = [];
                  // 먼저 innerPath.node.leadingComments 에서 주석을 찾습니다.
                  let comments = innerPath.node.leadingComments;
                  // 만약 없다면 부모 노드에서 찾는 대체 로직을 추가합니다.
                  if (!comments && innerPath.parent && innerPath.parent.leadingComments) {
                    comments = innerPath.parent.leadingComments;
                  }
                  if (comments) {
                    comments.forEach(comment => {
                      // 여러 줄 주석의 경우 각 줄을 trim() 처리
                      const lines = comment.value.split('\n').map(line => line.replace(/^\s*\*\s?/, '').trim());
                      lines.forEach(line => {
                        // 어노테이션 형식: @responseField 필드명 타입 required/optional 설명
                        const match = line.match(/@responseField\s+(\S+)\s+(\S+)\s+(\S+)\s+(.*)/);
                        if (match) {
                          responseFields.push({
                            field: match[1],
                            type: match[2],
                            required: match[3],
                            description: match[4].trim()
                          });
                        }
                      });
                    });
                  }
                  block.tests.push({
                    description: itArg.value,
                    responseFields
                  });
                }
              }
            }
          });
          describeStack.pop();
        }
      }
    }
  });

  return testInfo;
}

/**
 * 응답 필드 정보를 Markdown 표 형식 문자열로 변환합니다.
 * @param {Array} fields - 응답 필드 정보 배열
 * @returns {string} Markdown 표 문자열
 */
function renderResponseFieldsTable(fields) {
  if (!fields || !fields.length) {
    console.warn('renderResponseFieldsTable()에 전달된 fields가 비어있습니다.');
    return '';
  }
  let table = '';
  table += `| Field | Type | Required | Description |\n`;
  table += `| ----- | ---- | -------- | ----------- |\n`;
  fields.forEach(f => {
    table += `| ${f.field} | ${f.type} | ${f.required} | ${f.description} |\n`;
  });
  return table;
}

/**
 * describe 블록과 내부 테스트 케이스를 Markdown 문자열로 재귀적으로 변환합니다.
 * @param {Object} block - describe 블록 정보
 * @param {number} headerLevel - Markdown 제목 헤더 레벨 (예: 3 => ###)
 * @returns {string} Markdown 형식 문자열
 */
function renderDescribeBlock(block, headerLevel) {
  let md = `${'#'.repeat(headerLevel)} ${block.description}\n\n`;
  if (block.tests.length) {
    block.tests.forEach(test => {
      md += `- **${test.description}**\n\n`;
      // 응답 필드가 있다면 표 형식으로 추가
      if (test.responseFields && test.responseFields.length > 0) {
        md += renderResponseFieldsTable(test.responseFields);
        md += '\n';
      }
    });
  }
  if (block.children.length) {
    block.children.forEach(child => {
      md += renderDescribeBlock(child, headerLevel + 1);
    });
  }
  return md;
}

/**
 * 지정된 디렉토리 내의 테스트 파일들을 읽어 문서를 생성합니다.
 */
function generateDocumentation() {
  const testDir = path.join(__dirname, 'test'); // 테스트 파일들이 위치한 디렉토리
  const files = fs.readdirSync(testDir).filter(file => file.endsWith('.js'));
  const allTestInfo = [];

  files.forEach(file => {
    const filePath = path.join(testDir, file);
    const code = fs.readFileSync(filePath, 'utf-8');
    const testInfo = extractTestInfo(code);
    allTestInfo.push({ file, testInfo });
  });

  // Markdown 문서 내용 생성
  let docContent = '# 테스트 문서 자동 생성\n\n';
  allTestInfo.forEach(({ file, testInfo }) => {
    docContent += `## 파일: ${file}\n\n`;
    testInfo.forEach(describeBlock => {
      docContent += renderDescribeBlock(describeBlock, 3);
    });
  });

  fs.writeFileSync(path.join(__dirname, 'TEST_DOC.md'), docContent);
  console.log('테스트 문서가 생성되었습니다: TEST_DOC.md');
}

// 문서 생성 실행
generateDocumentation();
