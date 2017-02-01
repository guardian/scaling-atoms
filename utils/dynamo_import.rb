#!/usr/bin/env ruby

require 'aws-sdk-resources'
require 'trollop'
require 'awesome_print'
require 'json'

opts = Trollop::options do
  opt :tablename, "Name of the table to import to", :type=>:string
  opt :datafile, "Name of the json dump to import", :type=>:string
end

dynamodb = Aws::DynamoDB::Client.new(region: 'eu-west-1')

json_data = File.open(opts.datafile) do |f|
  JSON.parse(f.read)
end

page_size = 25
i=0
while i < json_data.length

  response = dynamodb.batch_write_item({
    request_items: {
      opts.tablename=>json_data.slice(i,page_size).map{|item|
          ap item
          {
            "put_request": {
              "item": item
            }
          }
      }
    }
  })
  ap response
  i+=page_size
end
