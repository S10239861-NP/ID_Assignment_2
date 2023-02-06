var Http = require("http");

var FileSystem = require("fs");

var http_server = null;

var port_num = 8080;

var host_name = "localhost";

var current_working_dir_path = "C:/Poly/Interactive_Development_Y1S2/ASG2/ID_Assignment_2";

function OnHttpServerStartListening()
{
    console.log("Started listening on port " + port_num + ".");
}

// Recursively searches for a file with the same name as the selected file name (parameter 1), looking
// through all files and directories under the specified directory path (parameter 2), as well as
// subdirectories under those directories if required, returns "" if no file was found at all, 
// otherwise returns a string containing the file path of the file with the same name as the 
// selected file name.
function SearchAllDirsForFile(file_name, working_dir_path)
{
    // console.log(`Checking directory at path '${working_dir_path}' for '${file_name}' file.`);

    let result_file_path = "";

    let working_dir_path_file_list = FileSystem.readdirSync(working_dir_path);

    for (let currentFileIndex = 0; currentFileIndex < working_dir_path_file_list.length; currentFileIndex++)
    {
        if (working_dir_path_file_list[currentFileIndex] == ".git" || working_dir_path_file_list[currentFileIndex] == ".gitignore")
        {
            continue;
        }

        if (working_dir_path_file_list[currentFileIndex] == file_name)
        {
            result_file_path = working_dir_path + "/" + file_name;

            break;
        }

        if (FileSystem.statSync(working_dir_path + "/" + working_dir_path_file_list[currentFileIndex]).isDirectory() == true)
        {
            result_file_path = SearchAllDirsForFile(file_name, working_dir_path + "/" + working_dir_path_file_list[currentFileIndex]);

            if (result_file_path != "")
            {
                break;
            }
        }
    }

    // console.log(`Result file path obtained: '${result_file_path}'`);

    return result_file_path;
}

function HandleRequest(request, response)
{
    // console.log(request.url);

    if (request.url == "/")
    {
        response.writeHead(200, {"Content-Type" : "text/html"});

        response.write(FileSystem.readFileSync(SearchAllDirsForFile("index.html", current_working_dir_path)));

        response.end();
    }
    else
    {
        // console.log(`Handling request for file with name '${request.url.replace("/", "")}'.`);

        // Procedure for handling requests for files (e.g. HTML files, CSS files and JS files) for 
        // a webpage when it is being loaded.
        // Sample request url for a file named 'script.js': /script.js
        let file_extension = request.url.split(".")[1];

        if (file_extension == "html")
        {
            response.writeHead(200, {"Content-Type" : "text/html"});
        }
        else if (file_extension == "css")
        {
            response.writeHead(200, {"Content-Type" : "text/css"});
        }
        else if (file_extension == "js")
        {
            response.writeHead(200, {"Content-Type" : "application/javascript"});
        }

        corresponding_file_path = SearchAllDirsForFile(request.url.replace("/", ""), current_working_dir_path);

        if (corresponding_file_path == "")
        {
            response.statusCode = 404;

            response.write("Status: Not Found.");
        }
        else
        {
            response.write(FileSystem.readFileSync(corresponding_file_path));
        }

        response.end();
    }
}

http_server = Http.createServer(HandleRequest);

http_server.listen(port_num, host_name, OnHttpServerStartListening);