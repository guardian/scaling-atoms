#!/usr/bin/env ruby

require 'aws-sdk-resources'
require 'trollop'
require 'awesome_print'
require 'json'

def convert_level(datahash)
  datahash.each do |k,v|
    if v.is_a?(Hash)
      datahash[k] = convert_level(v)
    else
      if v.is_a?(BigDecimal)
        datahash[k] = v.to_i
      end
    end
  end
  return datahash
end

opts = Trollop::options do
  opt :tablename, "Name of the table to dump", :type=>:string
end

dynamodb = Aws::DynamoDB::Client.new(region: 'eu-west-1')

response = dynamodb.scan({
  table_name: opts.tablename
})

puts response.items.map{|item| convert_level(item)}.to_json
