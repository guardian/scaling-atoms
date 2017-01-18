#!/usr/bin/env ruby

require 'aws-sdk-resources'
require 'trollop'
require 'awesome_print'
require 'json'

opts = Trollop::options do
  opt :tablename, "Name of the table to dump", :type=>:string
end

dynamodb = Aws::DynamoDB::Client.new(region: 'eu-west-1')

response = dynamodb.scan({
  table_name: opts.tablename
})

puts JSON.generate(response.items)
