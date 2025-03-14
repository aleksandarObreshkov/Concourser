# Concourser
Concourser is a VS Code extension that renders your Concourse pipeline files and provides functionalities such as Ctrl + click navigation and environment variable resolution.

## What this plugin does?
- enables Ctrl + Click navigation for:
  - your `file` properties in your task definitions.
  - your `SCRIPT_PATH` environment variables
  - your `run` properties inside your task configurations
- resolves environment variables for your Python scripts based on the global environment variables, defined in your Concourse pipeline file

## Configuration
In order for the extension to work, you need to define a `concourser.json` configuration file following the structure below:
```json
{
    "resources" : {
        "source-code":"C:\\Users\\aleks\\Projects\\pipeline",
        "euporie":"C:\\Users\\aleks\\Projects\\js"
    },
    "mainPipeline":"pipeline.yaml",
    "envKey":"envs"
}
```

- `mainPipeline` -> points to the main Concourse pipeline file
- `envKey` -> if your pipeline defines some environment variables globally, which are then reused in the tasks, you need to define the key of the list here. Here's an example:
  ```yaml
        ---
        resources:
            # resource definitions

        envs: &global-envs
            URL: https://google.com
            MY_VAR: someValue


        jobs:
            - task: "run"
              file: my-repo/main.yaml
              env:
                <<: *global-envs
  ```
  In this case, the `envs` array's elements will be added as environment variables in the container that executes the `run` task, so in your `concourser.json` you would need to specify:
  ```json
  {
    "envKey":"envs"
  }
  ```
  - `resources` -> Inside your Concourse pipeline, you are using the resources' names as part of the paths of some files. If you want to enable Ctrl+click navigation for those files, you need to tell the plugin where the real file is, or in other words where the folder that corresponds to the resource is. Here's an example:
    ```yaml
    resources:
    - name: "source-code"
      type: "git"
      # other resource configs
    
    jobs:
    - name: "basic"
      plan:
      - get: "source-code"
      - task: "run"
        file: source-code/task-config.yml
        env:
          SCRIPT_PATH: source-code.task
    ```

    In the sample pipeline above, you have the `source-code` resource, which you are then using to define the path for the `file` property of the `run` task. For the Ctrl + Click to work, you need to define the path ON YOUR MACHINE where the `source-code` folder is:
    ```json
    {
        "resources": {
            "source-code":"C:\\Users\\my-user\\Projects\\concourse-repo"
        }
    }
    ```
    > You need to define all the repos you are using in the `resources` object.
    > For the plugin to work, verify that VS Code [recognises the files](https://code.visualstudio.com/docs/languages/overview#_change-the-language-for-the-selected-file) as YAML/Python.


## Download

You can download the plugin from [here](https://drive.google.com/file/d/1m4t-I3WW2MG9FT1dpU6HHyRXALhhQ3-0/view?usp=drive_link).