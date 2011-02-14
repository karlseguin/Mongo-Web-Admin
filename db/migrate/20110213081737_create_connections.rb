class CreateConnections < ActiveRecord::Migration
  def self.up
    create_table :connections do |t|
      t.string :host
      t.integer :port
    end
  end

  def self.down
    drop_table :connections
  end
end
