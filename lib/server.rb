require "./lib/init"

disable :logging
set :root, File.dirname(__FILE__) + "/../"

get "/" do
  File.read("public/index.html")
end

get "/spits.json" do
  content_type "application/json"
  send_file "config/spits.json"
end
