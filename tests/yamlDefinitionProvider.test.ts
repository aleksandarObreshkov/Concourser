jest.mock('vscode');
import {isClickedLineResolvable, formPathToPythonScript} from '../src/yamlDefinitionProvider'


describe("tests if the clicked line is resolvable", () => {
  it.each([
    ["python3 -m my_script.script", true],
    ["run: uga_buga", true],
    ["SCRIPT_PATH: file.me.something", true],
    ["hello", false],
    ["file: somefile/there", true]
  ])("", (line, isResolvable) => {
    expect(isClickedLineResolvable(line)).toEqual(isResolvable);
  });
})


describe("tests if the python script path will be formatted properly", () => {
  it.each([
    ["python3 -m my_script.script", "my_script.script", "my_script/script.py"],
    ["SCRIPT_PATH: my_script.script", "my_script.script", "my_script/script.py"],
    ["run: python3 -m my_script.script", "my_script.script", "my_script/script.py"],
  ])("", (wholeLine, clickedText, result) => {
    expect(formPathToPythonScript(wholeLine, clickedText)).toEqual(result)
  })
})
