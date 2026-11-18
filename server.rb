#!/usr/bin/env ruby
# Pushpin Studios - Lightweight Local Web App Server
# Built-in Ruby WEBrick server with zero external dependencies

require 'webrick'

root = File.expand_path(__dir__)
port = 3000
server = nil

mime_types = WEBrick::HTTPUtils::DefaultMimeTypes.merge({
  'png'  => 'image/png',
  'jpg'  => 'image/jpeg',
  'jpeg' => 'image/jpeg',
  'svg'  => 'image/svg+xml',
  'pdf'  => 'application/pdf',
  'css'  => 'text/css',
  'js'   => 'application/javascript',
  'html' => 'text/html'
})

# Try ports from 3000 up to 3030 until one binds successfully
20.times do
  begin
    server = WEBrick::HTTPServer.new(
      Port: port,
      BindAddress: '127.0.0.1',
      DocumentRoot: root,
      MimeTypes: mime_types,
      AccessLog: [],
      Logger: WEBrick::Log.new(nil, WEBrick::Log::WARN)
    )
    break
  rescue Errno::EADDRINUSE, SocketError => e
    port += 1
  end
end

if server.nil?
  puts "Could not find an available port between 3000 and 3030."
  exit 1
end

trap('INT') { server.shutdown }
trap('TERM') { server.shutdown }

puts "\n" + "=" * 60
puts "  🎙️  PUSHPIN STUDIOS WEB APPLICATION IS LIVE! "
puts "=" * 60
puts "  ▶ Open in Browser: http://localhost:#{port}"
puts "  ▶ Studio Suite:    Banjara Hills, Hyderabad"
puts "  ▶ Press Ctrl+C to stop server"
puts "=" * 60 + "\n\n"

# Automatically open the browser on macOS
fork do
  sleep 0.5
  system("open", "http://localhost:#{port}")
end

server.start
